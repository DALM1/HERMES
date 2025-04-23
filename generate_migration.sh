#!/bin/bash

# Script pour générer une migration Phoenix
# Utilisation: ./generate_migration.sh create_users

set -e  # Arrête le script en cas d'erreur

if [ -z "$1" ]; then
  echo "[ERROR] Veuillez spécifier un nom pour la migration."
  echo "[INFO] Exemple: ./generate_migration.sh create_users"
  exit 1
fi

MIGRATION_NAME=$1

echo "=== Génération d'une migration Phoenix: $MIGRATION_NAME ==="

# Générer la migration
echo "[INFO] Génération de la migration..."
mix ecto.gen.migration $MIGRATION_NAME

echo "[INFO] Migration générée avec succès."
echo "[INFO] Vous pouvez maintenant éditer le fichier de migration dans le dossier priv/repo/migrations/"