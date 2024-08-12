import axios from "axios"

export const getUser = async () => {
  try {
    const response = await axios.get("http://localhost:80/api/user/", {
      withCredentials:true
    })

    if (response.data.status) {
      return response.data.user
    }

    return false

  } catch (error) {
    if (error === axios.AxiosError) {
      return false
    }
  }
}

