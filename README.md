# Car Insurance Lab

This repository contains a number of labs to lilustrate the use of Google Cloud Data and AI products using a car insurance dataset

## Setup

Once logged into a Google Cloud Project, open Cloud Shell and execute the following commands:

```bash
gcloud services enable bigqueryconnection.googleapis.com
gcloud services enable notebooks.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable bigquery.googleapis.com
gcloud services enable iam.googleapis.com

sleep 60


PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUM=$(gcloud projects list --filter="$PROJECT_ID" --format="value(PROJECT_NUMBER)")


gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:${PROJECT_NUM}-compute@developer.gserviceaccount.com"\
      --role='roles/aiplatform.serviceAgent'

gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:${PROJECT_NUM}-compute@developer.gserviceaccount.com"\
      --role='roles/artifactregistry.admin'

gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:${PROJECT_NUM}-compute@developer.gserviceaccount.com" \
        --role='roles/bigquery.connectionAdmin'

gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:${PROJECT_NUM}-compute@developer.gserviceaccount.com"\
      --role='roles/storage.admin'

gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:${PROJECT_NUM}@cloudbuild.gserviceaccount.com"\
      --role='roles/aiplatform.admin'

gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:$PROJECT_NUM-compute@developer.gserviceaccount.com"\
      --role='roles/resourcemanager.projectIamAdmin'

```

Next, navigate to Vertex AI > Workbench and create a new notebook of `INSTANCES` type.

Leave all the configuration as default.
Once the notebook is created, click on `OPEN JUPYTERLAB` to open the web interface.
Click on Git > Clone a Repository and enter the following URL `https://github.com/rkgogole/hdemo`.

Now, edit the `hdemo/src/datagen/launch_datagen.sh` script and ammend the values maked with `TO_DO_DEVELOPER`
Now, open a Terminal on the notebook and run the shell script, navigate to the datagen folder and:

```bash
source lanch_datagen.sh
```

This concludes the lab setup.

## Labs

Now you can follow the lab instructions on the following notebooks.

You can run all of them with default Python3 kernel

- Lab #1: Smart segmentation
  - [Code](src/notebooks/01_smart_segmentation.ipynb)
- Lab #2: Hyper personalized emails
  - [Code](src/notebooks/02_campaign_assets_hyper_personalized_email.ipynb)
- Lab #3: TimesFM forecasting
  - [Code](src/notebooks/03_revenue_forecast.ipynb)