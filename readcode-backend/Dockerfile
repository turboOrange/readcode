# Le Dockerfile contient du code qui va
# batir la Docker image.

FROM node:24.5.0-alpine3.22

# Specifier le dossier du code source de l'app a image
WORKDIR /usr/src/app

RUN npm install -g nodemon

# Les dependances (ex.: node_modules) sont installees
# en premier, pour qu'elles soient cached. 
#   --> On veut pas re-installer le node_modules au complet
#       a chaque fois qu'on change le code de l'app.
# 
# COPY : copy un fichier/dossier vers une destination
#        de l'image (ici on copy node_modules vers le cwd de l'image)
COPY package*.json ./

# On peut lancer une commande comme "npm install"
# pour installer nos dependances dans l'image
RUN ["npm","install"]

# maintenant qu'on a nos modules/dependances dans
# l'image, on peut copier le code source de l'app
# ici je copie le dossier courant (/backend) vers le
# cwd de l'image 
#   --> il faudra eviter de copier le dossier node_modules
#       via un fichier .dockerignore
COPY . ./

# On peut definir des variables d'environnement
# ici, elles seront lues par notre app NodeJS via
# process.env.[KEY] tout comme elles le sont lues
# par dotenv dans le fichier .env
# ENV PORT=8080

EXPOSE 8080

# lancer l'app
CMD ["sh", "-c", "npx prisma migrate dev --name migration1 && npm run start"]
