const API_BASE_URL = "https://localhost:7153";

export async function login(
  username: string,
  password: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/Auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Invalid username or password.");
  }

  return response.json();
}