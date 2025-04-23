#!/bin/bash

# Script de déploiement pour Hermes
# Ce script configure et démarre l'application en environnement de production

set -e  # Arrête le script en cas d'erreur

echo "=== Démarrage du déploiement de Hermes ==="

# Vérifier que Docker est en cours d'exécution
if ! docker info > /dev/null 2>&1; then
  echo "[ERROR] Docker n'est pas en cours d'exécution. Veuillez démarrer Docker et réessayer."
  exit 1
fi

# Arrêter les conteneurs existants
echo "[INFO] Arrêt des conteneurs existants..."
docker-compose down

# Reconstruire les images
echo "[INFO] Construction des images Docker..."
docker-compose build

# Démarrer uniquement la base de données d'abord
echo "[INFO] Démarrage de la base de données..."
docker-compose up -d db

# Attendre que la base de données soit prête
echo "[INFO] Attente du démarrage de la base de données..."
sleep 10

# Démarrer l'application
echo "[INFO] Démarrage de l'application..."
docker-compose up -d app

# Attendre que l'application soit prête
echo "[INFO] Attente du démarrage de l'application..."
sleep 5

# Créer la base de données si elle n'existe pas
echo "[INFO] Création de la base de données si nécessaire..."
docker-compose exec -T hermes_app bin/hermes eval "Hermes.Release.create()"

# Exécuter les migrations
echo "[INFO] Exécution des migrations de base de données..."
docker-compose exec -T hermes_app bin/hermes eval "Hermes.Release.migrate()"

echo "=== Déploiement terminé avec succès ==="
echo "[INFO] L'application est accessible à l'adresse: http://localhost:4000"

