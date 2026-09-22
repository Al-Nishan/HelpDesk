import { apiRequest } from "./api";

export async function getUsers() {
    return apiRequest("/api/Users");
}

export async function updateUserRole(
    userId: string,
    role: string
) {
    return apiRequest(`/api/Users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({
            role,
        }),
    });
}