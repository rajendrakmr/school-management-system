pipeline{
  agent any
  environment { 
    REPO_URL = 'https://github.com/rajendrakmr/school-management-system.git'
    BRANCH = 'main'
    FRONTEND_IMAGE_NAME = 'erp-school-app'
    BACKEND_IMAGE_NAME  = 'erp-school-api'
    REGISTRY = 'docker.io'
    DOCKER_CREDENTIALS = 'dockerHubCreds'
    DOCKER_USERNAME = 'cloudwithrk'
    OWASPENV="OWASP"
    SONAR_HOME = tool "Sonar"
    PROJECT = "school-management-backend"
  }
  parameters{
    string(name:"FRONTEND_IMAGE_TAG",defaultValue:"latest",description:"This is frontend parameter tag.")
    string(name:"BACKEND_IMAGE_TAG",defaultValue:"latest",description:"This is backend parameter tag.")
  }
  stages{
    stage("Validate: Parameters"){
      steps{
        script{
           if (params.FRONTEND_IMAGE_TAG == '' || params.BACKEND_IMAGE_TAG == '') {
            error("FRONTEND_IMAGE_TAG and BACKEND_IMAGE_TAG must be required.")
          }
        }
      }
    }
    stage("Workspace: Clean Up"){
      steps{
        cleanWs()
      }
    }
    stage("Git: Checkout"){
      steps{
        git url: env.REPO_URL,branch: env.BRANCH
      }
    }
    stage("Security: Trivy File Scan"){
      steps{
        sh "trivy fs --exit-code 1 --severity HIGH,CRITICAL ."
      }
    }
    stage("OWASP: Dependency Check"){
      steps{
        echo "Running OWASP Dependency Check..." 
          dependencyCheck additionalArguments: """
              -o './dependency-check-report'
              --scan './'
              --format HTML
              --format XML
              --prettyPrint
              --failOnCVSS 7.0
                """,
              odcInstallation: env.OWASPENV 
          }
      }
    }
    stage("OWASP: Publish Dependency Check Report"){
      steps{
        dependencyCheckPublisher pattern: 'dependency-check-report/dependency-check-report.xml'
        archiveArtifacts artifacts: 'dependency-check-report/*.html, dependency-check-report/*.xml'
      }
    }
    stage("SonarQube: Code Analysis"){
      withSonarQubeEnv("Sonar"){
        sh "$SONAR_HOME/bin/sonar-scanner -Dsonar.projectName=${env.PROJECT} -Dsonar.projectKey=${env.PROJECT}-${env.BRANCH} -X"
        }
      }
    }
    stage("SonarQube: Quality Gate"){
    steps{
      timeout(time: 1, unit: 'HOURS') {
        def qg = waitForQualityGate()
        if (qg.status != 'OK') {
          error "Pipeline failed due to Sonar Quality Gate: ${qg.status}"
         }
        }
      }
    }
     
    stage("Build: Docker Images"){
      parallel{
        stage("Build: Frontend Image"){
          steps{
            dir('fronted'){
              sh "docker build -t ${FRONTEND_IMAGE_NAME} ."
            }
          }
        }
        stage("Build: Backend Image"){
          steps{
            dir('backend'){
              sh "docker build -t ${BACKEND_IMAGE_NAME} ."
            }
          }
        }
      }
    } 

    stage('Publish: Push DockerHub') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: "${DOCKER_CREDENTIALS}",
          usernameVariable: 'DOCKER_USERNAME',
          passwordVariable: 'DOCKER_PASSWORD'
        )]) { 
          sh "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin"
          sh "docker tag ${FRONTEND_IMAGE_NAME}:latest ${DOCKER_USERNAME}/${FRONTEND_IMAGE_NAME}:${FRONTEND_IMAGE_TAG}"
          sh "docker tag ${BACKEND_IMAGE_NAME}:latest ${DOCKER_USERNAME}/${BACKEND_IMAGE_NAME}:${BACKEND_IMAGE_TAG}"
          echo "_________________ push docker image to docker hub...._____________________`"
          sh "docker push ${DOCKER_USERNAME}/${FRONTEND_IMAGE_NAME}:${FRONTEND_IMAGE_TAG}"
          sh "docker push ${DOCKER_USERNAME}/${BACKEND_IMAGE_NAME}:${BACKEND_IMAGE_TAG}"
        }
      }
    }
  }
  post{
    success {
    // Archive the XML artifacts
    archiveArtifacts artifacts: '*.xml', followSymlinks: false 
    // Trigger the downstream job
    build job: "ErpSms-CD", parameters: [
        string(name: 'FRONTEND_IMAGE_NAME', value: "${FRONTEND_IMAGE_NAME}"),
        string(name: 'BACKEND_IMAGE_NAME', value: "${BACKEND_IMAGE_NAME}"),

        string(name: 'FRONTEND_IMAGE_TAG', value: "${FRONTEND_IMAGE_TAG}"),
        string(name: 'BACKEND_IMAGE_TAG', value: "${BACKEND_IMAGE_TAG}"),
        
        string(name: 'GIT_URL', value: "${REPO_URL}"),
        string(name: 'BRANCH_NAME', value: "${BRANCH}")
      ] 
    }
  }
}