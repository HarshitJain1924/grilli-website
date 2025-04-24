pipeline {
    // Agent: Specify where the pipeline will run.
    // 'any' means Jenkins can use any available agent.
    // Make sure Docker is installed and runnable by the 'jenkins' user on this agent.
    agent any

    // Environment variables (optional, useful for tagging)
    environment {
        // If you're not pushing yet, this can be any name.
        IMAGE_NAME = "harshitjain1924/grilli-app"
        // Example: Use a simple registry if not Docker Hub
        // REGISTRY = "your-registry.example.com"
        // IMAGE_NAME = "${REGISTRY}/grilli-app"
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo 'Checking out code from repository...'
                // This command checks out the code from the SCM configured in the Jenkins job
                checkout scm
            }
        }

        stage('2. Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${env.IMAGE_NAME}:${env.BUILD_NUMBER}"
                    // Build the Docker image using the Dockerfile in the current directory (.)
                    // Tag it with the build number for uniqueness
                    docker.build("${env.IMAGE_NAME}:${env.BUILD_NUMBER}", ".")
                    // Optionally tag it as 'latest' as well
                    docker.build("${env.IMAGE_NAME}:latest", ".")
                }
            }
        }

        // --- Optional Stage: Push to Docker Registry ---
        // Uncomment this stage if you want to push the image.
        // Requires Docker Hub (or other registry) credentials configured in Jenkins.
        /*
        stage('3. Push Docker Image') {
            // Only run this stage on the 'main' branch, for example
            // when { branch 'main' }
            steps {
                script {
                    echo "Pushing Docker image: ${env.IMAGE_NAME}:${env.BUILD_NUMBER}"
                    // Use the credential ID you configured in Jenkins for Docker Hub/Registry
                    // Example Credential ID: 'dockerhub-credentials'
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        // Push the build number tag
                        docker.image("${env.IMAGE_NAME}:${env.BUILD_NUMBER}").push()
                        // Push the 'latest' tag
                        docker.image("${env.IMAGE_NAME}:latest").push()
                    }
                }
            }
        }
        */
        stage('4. Deploy (Simple Example)') {
            steps {
                 script {
                     echo "Deploying container..."
                     def containerName = "grilli-website-live"
                     def hostPort = 8080 // Choose an available port on the agent machine

                     // Stop and remove any existing container with the same name
                     sh "docker stop ${containerName} || true"
                     sh "docker rm ${containerName} || true"

                     // Run the newly built container
                     sh "docker run -d --name ${containerName} -p ${hostPort}:80 ${env.IMAGE_NAME}:${env.BUILD_NUMBER}"

                     echo "Application potentially deployed at http://<jenkins-agent-ip>:${hostPort}"
                 }
            }
        }
    }

    post {
        // Actions to always run at the end of the pipeline, regardless of success/failure
        always {
            echo 'Pipeline finished.'
            // Optional: Clean up old Docker images on the agent to save space
            // Be careful with prune commands in shared environments!
            // script {
            //     sh 'docker image prune -f'
            // }
        }
        success {
            echo 'Pipeline completed successfully!'
            // Send notifications, etc.
        }
        failure {
            echo 'Pipeline failed.'
            // Send notifications, etc.
        }
    }
}