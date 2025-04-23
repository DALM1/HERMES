# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#

alias Hermes.Repo
alias Hermes.Accounts
alias Hermes.Chat

# Create users
{:ok, user1} = Accounts.create_user(%{
  username: "john_doe",
  email: "john@example.com",
  password: "password123",
  full_name: "John Doe"
})

{:ok, user2} = Accounts.create_user(%{
  username: "jane_smith",
  email: "jane@example.com",
  password: "password123",
  full_name: "Jane Smith"
})

{:ok, user3} = Accounts.create_user(%{
  username: "bob_johnson",
  email: "bob@example.com",
  password: "password123",
  full_name: "Bob Johnson"
})

# Create a conversation between users
{:ok, %{conversation: conversation}} = Chat.create_conversation(%{
  name: "General Chat",
  description: "A general chat for everyone"
}, [user1.id, user2.id, user3.id])

# Add some messages
{:ok, _message1} = Chat.create_message(%{
  conversation_id: conversation.id,
  user_id: user1.id,
  content: "Hello everyone!",
  content_type: "text"
})

{:ok, _message2} = Chat.create_message(%{
  conversation_id: conversation.id,
  user_id: user2.id,
  content: "Hi John, how are you?",
  content_type: "text"
})

{:ok, message3} = Chat.create_message(%{
  conversation_id: conversation.id,
  user_id: user3.id,
  content: "Hey folks, nice to meet you all!",
  content_type: "text"
})

# Add a reaction to a message
Chat.add_reaction(message3.id, user1.id, "👍")
Chat.add_reaction(message3.id, user2.id, "❤️")

IO.puts("Database seeded successfully!")