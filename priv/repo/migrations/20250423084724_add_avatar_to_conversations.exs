defmodule Hermes.Repo.Migrations.AddAvatarToConversations do
  use Ecto.Migration

  def up do
    execute "ALTER TABLE conversations ADD COLUMN IF NOT EXISTS avatar text"
  end

  def down do
    # Ne rien faire en cas de rollback
  end
end
