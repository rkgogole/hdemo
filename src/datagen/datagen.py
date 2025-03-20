import pandas as pd
import numpy as np
import random
import uuid
import os
from datetime import timedelta
from faker import Faker
from google.cloud import bigquery
from google.oauth2 import service_account

PROJECT_ID = os.environ.get("PROJECT_ID")
DATASET_ID = os.environ.get("DATASET_ID")
GCP_LOCATION = os.environ.get("GCP_LOCATION")


class SyntheticDataGenerator:
    """
    A class to generate synthetic data for insurance customers, policies, and analytics.
    """

    def __init__(self, seed=42, locale="en_US"):
        """
        Initialize the data generator with a seed for reproducibility.

        Args:
            seed (int): Random seed for reproducibility
            locale (str): Locale for Faker
        """
        self.seed = seed
        random.seed(seed)
        np.random.seed(seed)
        self.faker = Faker(locale)
        self.faker.seed_instance(seed)

        self.car_brands = [
            "Toyota",
            "Honda",
            "Ford",
            "BMW",
            "Mercedes",
            "Audi",
            "Volkswagen",
            "Nissan",
            "Hyundai",
            "Kia",
            "Chevrolet",
            "Mazda",
            "Subaru",
            "Lexus",
            "Volvo",
        ]

        self.pages = [
            "homepage",
            "car_insurance",
            "life_insurance",
            "health_insurance",
            "contact_us",
            "about_us",
            "claims",
            "quote",
            "payment",
            "account",
            "faq",
            "policy_details",
            "coverage_options",
        ]

        self.customer_df = None
        self.policy_df = None
        self.analytics_df = None

    def generate_customer_data(self, num_customers=1000):
        """
        Generate synthetic customer profile data.

        Args:
            num_customers (int): Number of customer profiles to generate

        Returns:
            pandas.DataFrame: DataFrame containing customer data
        """
        data = []

        for _ in range(num_customers):
            gender = random.choice(["Male", "Female"])
            if gender == "Male":
                first_name = self.faker.first_name_male()
            else:
                first_name = self.faker.first_name_female()

            customer = {
                "customer_id": str(uuid.uuid4()),
                "first_name": first_name,
                "last_name": self.faker.last_name(),
                "gender": gender,
                "age": random.randint(18, 85),
                "birth_date": self.faker.date_of_birth(minimum_age=18, maximum_age=85),
                "email": self.faker.email(),
                "phone_number": self.faker.phone_number(),
                "street_address": self.faker.street_address(),
                "city": self.faker.city(),
                "state": self.faker.state_abbr(),
                "postal_code": self.faker.zipcode(),
                "country": self.faker.country_code(),
                "registration_date": self.faker.date_time_between(
                    start_date="-5y", end_date="now"
                ),
            }
            data.append(customer)

        self.customer_df = pd.DataFrame(data)
        return self.customer_df

    def generate_policy_data(self, customer_df=None):
        """
        Generate synthetic policy data for customers.

        Args:
            customer_df (pandas.DataFrame, optional): Customer data.
                If None, uses previously generated data.

        Returns:
            pandas.DataFrame: DataFrame containing policy data
        """
        if customer_df is None:
            if self.customer_df is None:
                raise ValueError(
                    "No customer data available. Generate customer data first."
                )
            customer_df = self.customer_df

        data = []

        for _, customer in customer_df.iterrows():
            policy = {
                "policy_id": str(uuid.uuid4()),
                "customer_id": customer["customer_id"],
                "policy_type": "Car Insurance",
                "start_date": self.faker.date_time_between(
                    start_date=customer["registration_date"], end_date="now"
                ),
                "car_brand": random.choice(self.car_brands),
                "car_model": self.faker.word().capitalize(),
                "car_year": random.randint(2000, 2023),
                "has_garage": random.choice([True, False]),
                "has_second_driver": random.choice([True, False]),
                "years_with_license": min(random.randint(1, 50), customer["age"] - 18),
                "num_accidents": random.choices(
                    [0, 1, 2, 3, 4], weights=[0.7, 0.15, 0.1, 0.03, 0.02]
                )[0],
                "risk_profile": random.choice(["Low", "Medium", "High"]),
                "premium_amount": random.uniform(500, 2000),
                "coverage_level": random.choice(["Basic", "Standard", "Premium"]),
                "payment_frequency": random.choice(
                    ["Monthly", "Quarterly", "Semi-Annual", "Annual"]
                ),
            }

            if policy["num_accidents"] >= 3:
                policy["risk_profile"] = "High"
            elif policy["num_accidents"] == 0 and policy["years_with_license"] > 10:
                policy["risk_profile"] = "Low"

            if policy["risk_profile"] == "High":
                policy["premium_amount"] *= 1.5
            elif policy["risk_profile"] == "Low":
                policy["premium_amount"] *= 0.8

            data.append(policy)

        self.policy_df = pd.DataFrame(data)
        return self.policy_df

    def generate_analytics_data(self, customer_df=None, num_sessions_per_customer=1):
        """
        Generate synthetic Adobe Analytics data for customers.

        Args:
            customer_df (pandas.DataFrame, optional): Customer data.
                If None, uses previously generated data.
            num_sessions_per_customer (int): Average number of sessions per customer

        Returns:
            pandas.DataFrame: DataFrame containing analytics data
        """
        if customer_df is None:
            if self.customer_df is None:
                raise ValueError(
                    "No customer data available. Generate customer data first."
                )
            customer_df = self.customer_df

        data = []

        for _, customer in customer_df.iterrows():
            num_sessions = max(1, int(np.random.poisson(num_sessions_per_customer)))

            for _ in range(num_sessions):
                session_start = self.faker.date_time_between(
                    start_date="-30d", end_date="now"
                )

                session_length_minutes = random.randint(1, 60)
                session_end = session_start + timedelta(minutes=session_length_minutes)

                num_pages = random.randint(1, 15)

                visited_simulation = random.random() < 0.3

                from_email_marketing = random.random() < 0.25

                hits = num_pages * random.randint(1, 5)

                response = random.random() < 0.2

                session = {
                    "session_id": str(uuid.uuid4()),
                    "customer_id": customer["customer_id"],
                    "session_start": session_start,
                    "session_end": session_end,
                    "session_length_minutes": session_length_minutes,
                    "pages_visited": num_pages,
                    "visited_simulation": visited_simulation,
                    "from_email_marketing": from_email_marketing,
                    "hits": hits,
                    "response": response,
                    "device_type": random.choice(["Desktop", "Mobile", "Tablet"]),
                    "browser": random.choice(["Chrome", "Firefox", "Safari", "Edge"]),
                    "operating_system": random.choice(
                        ["Windows", "MacOS", "iOS", "Android", "Linux"]
                    ),
                }

                data.append(session)

        self.analytics_df = pd.DataFrame(data)
        return self.analytics_df

    def save_to_parquet(self, output_dir="data"):
        """
        Save all generated data to parquet files.

        Args:
            output_dir (str): Directory to save the parquet files

        Returns:
            dict: Paths to the saved parquet files
        """
        os.makedirs(output_dir, exist_ok=True)

        paths = {}

        if self.customer_df is not None:
            customer_path = os.path.join(output_dir, "customers.parquet")
            self.customer_df.to_parquet(customer_path, index=False)
            paths["customers"] = customer_path

        if self.policy_df is not None:
            policy_path = os.path.join(output_dir, "policies.parquet")
            self.policy_df.to_parquet(policy_path, index=False)
            paths["policies"] = policy_path

        if self.analytics_df is not None:
            analytics_path = os.path.join(output_dir, "analytics.parquet")
            self.analytics_df.to_parquet(analytics_path, index=False)
            paths["analytics"] = analytics_path

        return paths

    def load_to_bigquery(self, project_id, dataset_id, credentials_path=None):
        """
        Load all generated data to BigQuery.

        Args:
            project_id (str): Google Cloud project ID
            dataset_id (str): BigQuery dataset ID
            credentials_path (str, optional): Path to service account credentials JSON file

        Returns:
            dict: BigQuery table references
        """
        if credentials_path:
            credentials = service_account.Credentials.from_service_account_file(
                credentials_path, scopes=["https://www.googleapis.com/auth/bigquery"]
            )
            client = bigquery.Client(credentials=credentials, project=project_id)
        else:
            client = bigquery.Client(project=project_id)

        dataset_ref = f"{project_id}.{dataset_id}"
        try:
            client.get_dataset(dataset_ref)
        except Exception:
            dataset = bigquery.Dataset(dataset_ref)
            dataset.location = GCP_LOCATION
            client.create_dataset(dataset, exists_ok=True)

        table_refs = {}

        if self.customer_df is not None:
            table_id = f"{dataset_ref}.customers"
            job_config = bigquery.LoadJobConfig(
                write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
            )
            job = client.load_table_from_dataframe(
                self.customer_df, table_id, job_config=job_config
            )
            job.result()
            table_refs["customers"] = table_id

        if self.policy_df is not None:
            table_id = f"{dataset_ref}.policies"
            job_config = bigquery.LoadJobConfig(
                write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
            )
            job = client.load_table_from_dataframe(
                self.policy_df, table_id, job_config=job_config
            )
            job.result()
            table_refs["policies"] = table_id

        if self.analytics_df is not None:
            table_id = f"{dataset_ref}.analytics"
            job_config = bigquery.LoadJobConfig(
                write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
            )
            job = client.load_table_from_dataframe(
                self.analytics_df, table_id, job_config=job_config
            )
            job.result()
            table_refs["analytics"] = table_id

        return table_refs

    def generate_all_data(self, num_customers=1000, num_sessions_per_customer=3):
        """
        Generate all types of data at once.

        Args:
            num_customers (int): Number of customer profiles to generate
            num_sessions_per_customer (int): Average number of sessions per customer

        Returns:
            tuple: (customer_df, policy_df, analytics_df)
        """
        self.generate_customer_data(num_customers)
        self.generate_policy_data()
        self.generate_analytics_data(
            num_sessions_per_customer=num_sessions_per_customer
        )

        return self.customer_df, self.policy_df, self.analytics_df


if __name__ == "__main__":
    generator = SyntheticDataGenerator(seed=42)

    customers, policies, analytics = generator.generate_all_data(
        num_customers=2000, num_sessions_per_customer=3
    )

    paths = generator.save_to_parquet(output_dir="data")
    print(f"Data saved to: {paths}")

    table_refs = generator.load_to_bigquery(
        project_id=PROJECT_ID,
        dataset_id=DATASET_ID
    )
    print(f"Data loaded to BigQuery tables: {table_refs}")
