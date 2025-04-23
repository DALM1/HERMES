defmodule Hermes.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :username, :string, null: false
      add :email, :string, null: false
      add :password_hash, :string, null: false
      add :full_name, :string
      add :bio, :text
      add :profile_picture, :string
      add :last_seen_at, :utc_datetime
      add :is_online, :boolean, default: false
      add :is_verified, :boolean, default: false
      add :settings, :map, default: %{}

      timestamps()
    end

    create unique_index(:users, [:username])
    create unique_index(:users, [:email])
  end
end