#!/bin/bash

# Script de déploiement pour Hermes
# Ce script configure et démarre l'application en environnement de production

set -e

echo "=== Démarrage du déploiement de Hermes ==="

if ! docker info > /dev/null 2>&1; then
  echo "[ERROR] Docker n'est pas en cours d'exécution. Veuillez démarrer Docker et réessayer."
  exit 1
fi

echo "[INFO] Arrêt des conteneurs existants..."
docker-compose down

echo "[INFO] Construction des images Docker..."
docker-compose build

echo "[INFO] Démarrage de la base de données..."
docker-compose up -d db

echo "[INFO] Attente du démarrage de la base de données..."
sleep 10

echo "[INFO] Démarrage de l'application..."
docker-compose up -d app

echo "[INFO] Attente du démarrage de l'application..."
sleep 5

echo "[INFO] Création de la base de données si nécessaire..."
docker-compose exec -T hermes_app bin/hermes eval "Hermes.Release.create()"

echo "[INFO] Exécution des migrations de base de données..."
docker-compose exec -T hermes_app bin/hermes eval "Hermes.Release.migrate()"

echo "=== Déploiement terminé avec succès ==="
echo "[INFO] L'application est accessible à l'adresse: http://localhost:4000"
