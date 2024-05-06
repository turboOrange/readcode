# INM5151_session_projet

# explications
## start.sh stop.sh
Le start.sh et stop.sh c'est pour partir le docker compose
La premiere fois il faut fair:
`sudo chmod +x start.sh`
`sudo chmod +x start.sh`
et pour l'utiliser:
`./start.sh`
ou
`./stop.sh`

## compose.yaml
C'est le script docker compose qui part les containers

## db
C'est la ou la db met ses fichiés. Cette enplacement existe pour que l'on garde en memoire la db si il y a un reboot. On peut effacer les fichiés a l'intarieur pour reset la db.

## docker
C'est la ou l'on a tout ce qui concerne le container de l'app

## docker/app
C'est ou on met notre code. a l'execution du docker, tout ce qui est ici vas etre transfété dans l'image docker

## docker/app.Dockerfile
C'est le script docker pour la configuration de l'environement. C'est la que l'on ecrit les installations nessesaires et la ligne a executer au demarage.
