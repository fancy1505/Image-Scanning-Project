pipeline {

    agent any

    environment {
        SLACK_WEBHOOK_URL = credentials('SLACK_WEBHOOK_URL')
        SONAR_TOKEN = credentials('SONAR_TOKEN')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Secret Scan') {
            steps {
                powershell '''
                gitleaks detect --source . --report-format json --report-path reports/gitleaks-report.json
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                powershell '''
                sonar-scanner `
                  -Dsonar.login=$env:SONAR_TOKEN
                '''
            }
        }

        stage('Filesystem Scan') {
            steps {
                powershell '''
                trivy fs . --severity HIGH,CRITICAL --format json -o reports/trivy-fs-report.json
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                powershell '''
                docker build -t shopnow-backend:v1 .\\shopNow\\backend
                docker build -t shopnow-frontend:v1 .\\shopNow\\frontend
                docker build -t shopnow-admin:v1 .\\shopNow\\admin
                '''
            }
        }

        stage('Container Scan') {
            steps {
                powershell '''
                trivy image shopnow-backend:v1 --severity HIGH,CRITICAL --format json -o reports/backend-report.json

                trivy image shopnow-frontend:v1 --severity HIGH,CRITICAL --format json -o reports/frontend-report.json

                trivy image shopnow-admin:v1 --severity HIGH,CRITICAL --format json -o reports/admin-report.json
                '''
            }
        }

        stage('Generate Reports') {
            steps {
                powershell '''
                python scripts\\report_generator.py
                '''
            }
        }

        stage('Slack Notification') {
            steps {
                powershell '''
                python scripts\\slack_notify.py
                '''
            }
        }
    }

    post {

        always {

            archiveArtifacts artifacts: 'reports/*', fingerprint: true

        }

        success {

            echo 'Pipeline completed successfully.'

        }

        failure {

            echo 'Pipeline failed.'

        }
    }
}