import axios from "axios";

class ApiService {
  static BASE_URL = "http://localhost:4000"; // JSON Server URL

  /** AUTHENTICATION */
  static async login(email, password) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/users?email=${email}&password=${password}`
      );
      if (response.data.length > 0) {
        const user = response.data[0];
        sessionStorage.setItem("user", JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, message: "Invalid credentials" };
    } catch (error) {
      return { success: false, message: "Login failed" };
    }
  }

  static logout() {
    sessionStorage.removeItem("user");
  }

  static getUser() {
    return JSON.parse(sessionStorage.getItem("user"));
  }

  static isAuthenticated() {
    return this.getUser() !== null;
  }

  static isAdmin() {
    const user = this.getUser();
    return user?.role === "admin";
  }

  /** PRODUCTS API */
  static async getProducts() {
    const response = await axios.get(`${this.BASE_URL}/products`);
    return response.data;
  }

  static async getProductById(id) {
    const response = await axios.get(`${this.BASE_URL}/products/${id}`);
    return response.data;
  }

  static async addProduct(product) {
    const response = await axios.post(`${this.BASE_URL}/products`, product);
    return response.data;
  }

  static async updateProduct(id, updatedProduct) {
    const response = await axios.put(
      `${this.BASE_URL}/products/${id}`,
      updatedProduct
    );
    return response.data;
  }

  static async deleteProduct(id) {
    const response = await axios.delete(`${this.BASE_URL}/products/${id}`);
    return response.data;
  }

  /** USERS API */
  static async getUsers() {
    const response = await axios.get(`${this.BASE_URL}/users`);
    return response.data;
  }

  static async getUserById(id) {
    const response = await axios.get(`${this.BASE_URL}/users/${id}`);
    return response.data;
  }

  static async deleteUser(id) {
    const response = await axios.delete(`${this.BASE_URL}/users/${id}`);
    return response.data;
  }

  /** REGISTER USER */
  static async registerUser(userData) {
    try {
      // Check if email already exists
      const existingUsers = await axios.get(
        `${this.BASE_URL}/users?email=${userData.email}`
      );
      if (existingUsers.data.length > 0) {
        return {
          success: false,
          message: "Email already exists. Please use a different email.",
        };
      }

      // Register new user
      const response = await axios.post(`${this.BASE_URL}/users`, userData);
      return {
        success: true,
        data: response.data,
        message: "Registration successful!",
      };
    } catch (error) {
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    }
  }

  /** TRANSACTIONS API */
  static async getTransactions() {
    const response = await axios.get(`${this.BASE_URL}/transactions`);
    console.log("Transactions API Response:", response.data);
    return response.data;
  }

  static async getAllTransactions() {
    return this.getTransactions();
  }

  static async addTransaction(transaction) {
    const response = await axios.post(
      `${this.BASE_URL}/transactions`,
      transaction
    );
    return response.data;
  }

  static async getTransactionById(id) {
    const response = await axios.get(`${this.BASE_URL}/transactions/${id}`);
    return response.data;
  }

  /** CATEGORIES API */
  static async getAllCategory() {
    try {
      const response = await axios.get(`${this.BASE_URL}/categories`);
      console.log("Categories API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  static async createCategory(category) {
    const response = await axios.post(`${this.BASE_URL}/categories`, category);
    return response.data;
  }

  static async updateCategory(id, updatedCategory) {
    const response = await axios.put(
      `${this.BASE_URL}/categories/${id}`,
      updatedCategory
    );
    return response.data;
  }

  static async deleteCategory(id) {
    const response = await axios.delete(`${this.BASE_URL}/categories/${id}`);
    return response.data;
  }

  /** SUPPLIERS API */
  static async getAllSuppliers() {
    try {
      const response = await axios.get(`${this.BASE_URL}/suppliers`);
      console.log("Suppliers API Response:", response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      throw error;
    }
  }

  static async getSupplierById(id) {
    try {
      const response = await axios.get(`${this.BASE_URL}/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching supplier by ID:", error);
      throw error;
    }
  }

  static async createSupplier(supplier) {
    const response = await axios.post(`${this.BASE_URL}/suppliers`, supplier);
    return response.data;
  }

  static async updateSupplier(id, updatedSupplier) {
    const response = await axios.put(
      `${this.BASE_URL}/suppliers/${id}`,
      updatedSupplier
    );
    return response.data;
  }

  static async deleteSupplier(id) {
    const response = await axios.delete(`${this.BASE_URL}/suppliers/${id}`);
    return response.data;
  }

  /** PROFILE - FETCH CURRENT USER INFO */
  static getLoggedInUserInfo() {
    const user = this.getUser(); // Get the currently logged-in user from sessionStorage
    return user ? user : null; // If no user, return null
  }
}

export default ApiService;
