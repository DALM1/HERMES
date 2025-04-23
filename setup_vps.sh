#!/bin/bash

# Script de configuration pour un VPS Ubuntu
# Ce script installe Docker et docker-compose sur un VPS Ubuntu

set -e  # Arrête le script en cas d'erreur

echo "🚀 Configuration du VPS pour Hermes..."

# Mettre à jour les paquets
echo "🔄 Mise à jour des paquets..."
apt-get update
apt-get upgrade -y

# Installer les dépendances
echo "📦 Installation des dépendances..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Ajouter la clé GPG officielle de Docker
echo "🔑 Ajout de la clé GPG de Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Configurer le dépôt stable
echo "📝 Configuration du dépôt Docker..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker Engine
echo "🐳 Installation de Docker Engine..."
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io

# Installer Docker Compose
echo "🧩 Installation de Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Configurer le pare-feu
echo "🔒 Configuration du pare-feu..."
apt-get install -y ufw
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

echo "✅ Configuration du VPS terminée avec succès!"
echo "🚀 Vous pouvez maintenant déployer Hermes avec le script deploy.sh"