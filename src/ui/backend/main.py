import os
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from google.cloud import bigquery
from google import genai

app = FastAPI(
    title="Smart Segmentation API",
    description="API for customer segmentation using embeddings and k-means clustering",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
PROJECT_ID = "TO_DO_DEVELOPER"
GCP_LOCATION = "TO_DO_DEVELOPER"
DATASET_ID = "TO_DO_DEVELOPER"

# Set up environment variables
os.environ["GOOGLE_CLOUD_PROJECT"] = PROJECT_ID
os.environ["GOOGLE_CLOUD_LOCATION"] = GCP_LOCATION
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "True"

# Initialize clients
bq_client = bigquery.Client()
genai_client = genai.Client(project=PROJECT_ID, location="us-central1", vertexai=True)


# Models
class Customer(BaseModel):
    customer_id: str
    age: int
    gender: str
    country: Optional[str] = None
    registration_date: Optional[str] = None

    # The model allows additional fields through the dynamic model
    class Config:
        extra = "allow"


class CustomerCluster(BaseModel):
    customer_id: str
    cluster_id: int
    cluster_name: str
    customer_data: dict


# Cluster names mapping (from the Gemini generated clusters)
CLUSTER_NAMES = {
    0: "Budget-Conscious Young Drivers",
    1: "High-Value Mature Motorists",
    2: "Digital-Savvy Family Policyholders",
    3: "Risk-Averse Senior Drivers",
    4: "Premium Urban Professionals",
    5: "Cautious Middle-Aged Commuters",
    6: "New License Budget Shoppers",
    7: "Luxury Vehicle Enthusiasts",
}


@app.get("/", response_model=dict)
async def root():
    return {"message": "Welcome to Smart Segmentation API"}


@app.get("/customers", response_model=List[Dict[str, Any]])
async def get_customers(limit: int = Query(100, ge=1, le=1000)):
    """
    Get all customer data from BigQuery with pagination, including policy and analytics data
    """
    query = f"""
    SELECT 
        c.*,
        p.*,
        cd.customer_description
    FROM 
        `{PROJECT_ID}.{DATASET_ID}.customers` c
    LEFT JOIN 
        `{PROJECT_ID}.{DATASET_ID}.policies` p ON c.customer_id = p.customer_id
    LEFT JOIN 
        `{PROJECT_ID}.{DATASET_ID}.customer_descriptions` cd ON c.customer_id = cd.customer_id
    LIMIT {limit}
    """

    try:
        df = bq_client.query(query).to_dataframe()

        # Convert timestamps to strings before returning
        for col in df.select_dtypes(include=["datetime64[ns]"]).columns:
            df[col] = df[col].astype(str)

        return df.to_dict("records")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error querying BigQuery: {str(e)}"
        )


@app.get("/customers/search", response_model=List[dict])
async def search_customers(
    query: str = Query(..., min_length=3), top_k: int = Query(5, ge=1, le=20)
):
    """
    Search for customers using natural language via the embedding semantic model
    """
    search_query = f"""
    WITH customer_ids AS (
        SELECT
          distance,
          base.customer_id,
        FROM VECTOR_SEARCH(
          (SELECT * FROM `{DATASET_ID}.customer_description_embeddings`),
          'customer_description_embedding',
          (
            SELECT ml_generate_embedding_result, content AS query
            FROM ML.GENERATE_EMBEDDING(
              MODEL `{DATASET_ID}.google-textembedding`,
                (SELECT "{query}" AS content),
                STRUCT(
                  TRUE AS flatten_json_output,
                  'SEMANTIC_SIMILARITY' as task_type,
                  768 AS output_dimensionality
                )
            )
          ),
          top_k => {top_k},
          distance_type => 'COSINE'
        ))
        
        SELECT 
          c.*,
          p.*,
          cd.customer_description,
          ci.distance as similarity_score
        FROM `{DATASET_ID}.customers` c
        JOIN `{DATASET_ID}.policies` p ON c.customer_id = p.customer_id
        JOIN `{DATASET_ID}.customer_descriptions` cd ON c.customer_id = cd.customer_id
        JOIN customer_ids ci ON c.customer_id = ci.customer_id
        ORDER BY ci.distance
    """

    try:
        df = bq_client.query(search_query).to_dataframe()
        # Convert timestamps to strings before returning
        for col in df.select_dtypes(include=["datetime64[ns]"]).columns:
            df[col] = df[col].astype(str)
        return df.to_dict("records")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error performing semantic search: {str(e)}"
        )


@app.get("/customers/clusters", response_model=List[Dict[str, Any]])
async def get_customer_clusters(
    cluster_id: Optional[int] = None, limit: int = Query(10, ge=1, le=100)
):
    """
    Retrieve customers by cluster with cluster name
    """
    where_clause = (
        f"WHERE cp.centroid_id = {cluster_id}" if cluster_id is not None else ""
    )

    query = f"""
    SELECT 
      cp.customer_id, 
      cp.centroid_id AS cluster_id,
      c.*,
      p.*,
      cd.customer_description
    FROM `{DATASET_ID}.customer_clusters_predictions` cp
    JOIN `{DATASET_ID}.customers` c ON cp.customer_id = c.customer_id
    JOIN `{DATASET_ID}.policies` p ON c.customer_id = p.customer_id
    LEFT JOIN `{DATASET_ID}.customer_descriptions` cd ON c.customer_id = cd.customer_id
    {where_clause}
    ORDER BY cp.centroid_id
    LIMIT {limit}
    """

    try:
        df = bq_client.query(query).to_dataframe()

        # Convert timestamps to strings before returning
        for col in df.select_dtypes(include=["datetime64[ns]"]).columns:
            df[col] = df[col].astype(str)

        # Add cluster names directly to the results
        results = []
        for _, row in df.iterrows():
            cluster_id = int(row["cluster_id"])

            # Create a dictionary with all row values
            customer_dict = row.to_dict()

            # Add the cluster name
            customer_dict["cluster_name"] = CLUSTER_NAMES.get(
                cluster_id, f"Cluster {cluster_id}"
            )

            results.append(customer_dict)

        return results
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving cluster data: {str(e)}"
        )


@app.get("/clusters/stats", response_model=dict)
async def get_cluster_stats():
    """
    Get statistics and descriptions for all clusters
    """
    query = f"""
    SELECT 
      cp.centroid_id AS cluster_id,
      COUNT(*) AS customer_count,
      AVG(c.age) AS avg_age,
      AVG(p.premium_amount) AS avg_premium,
      AVG(p.years_with_license) AS avg_years_license,
      AVG(p.num_accidents) AS avg_accidents
    FROM `{DATASET_ID}.customer_clusters_predictions` cp
    JOIN `{DATASET_ID}.customers` c ON cp.customer_id = c.customer_id
    JOIN `{DATASET_ID}.policies` p ON c.customer_id = p.customer_id
    GROUP BY cp.centroid_id
    ORDER BY cp.centroid_id
    """

    try:
        df = bq_client.query(query).to_dataframe()

        # Create a dictionary with cluster info
        clusters = {}
        for _, row in df.iterrows():
            cluster_id = int(row["cluster_id"])

            clusters[cluster_id] = {
                "cluster_name": CLUSTER_NAMES.get(cluster_id, f"Cluster {cluster_id}"),
                "customer_count": int(row["customer_count"]),
                "stats": {
                    "avg_age": float(row["avg_age"]),
                    "avg_premium": float(row["avg_premium"]),
                    "avg_years_license": float(row["avg_years_license"]),
                    "avg_accidents": float(row["avg_accidents"]),
                },
            }

        return {"clusters": clusters}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving cluster statistics: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
