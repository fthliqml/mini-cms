import { getUsers } from "./get-users";

export async function getUserOptions() {
  const response = await getUsers({ page: 1, perPage: 100 });

  return response.items;
}
