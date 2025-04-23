defmodule Hermes.Repo.Migrations.AddAllMissingColumnsToConversations do
  use Ecto.Migration

  def up do
    # Vérifier et ajouter chaque colonne individuellement
    execute "ALTER TABLE conversations ADD COLUMN IF NOT EXISTS name varchar"
    execute "ALTER TABLE conversations ADD COLUMN IF NOT EXISTS type varchar DEFAULT 'direct'"
    execute "ALTER TABLE conversations ADD COLUMN IF NOT EXISTS description text"
    execute "ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_group boolean DEFAULT false"
    execute "ALTER TABLE conversations ADD COLUMN IF NOT EXISTS last_message_at timestamptz"
  end

  def down do
    # Ne rien faire en cas de rollback, car supprimer ces colonnes pourrait être destructif
  end
end
