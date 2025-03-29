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

  /** USER MANAGEMENT API */
  static async getUsers() {
    try {
      const response = await axios.get(`${this.BASE_URL}/users`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  static async getUserById(id) {
    try {
      const response = await axios.get(`${this.BASE_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("Failed to fetch user data");
    }
  }

  static async addUser(user) {
    try {
      const response = await axios.post(`${this.BASE_URL}/users`, user);
      return response.data;
    } catch (error) {
      console.error("Error adding user:", error);
      throw new Error("Failed to add user");
    }
  }

  static async updateUser(id, updatedUser) {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/users/${id}`,
        updatedUser
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }

  static async deleteUser(id) {
    const response = await axios.delete(`${this.BASE_URL}/users/${id}`);
    return response.data;
  }

  /** PRODUCTS API */
  static async getProducts() {
    try {
      const response = await axios.get(`${this.BASE_URL}/products`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
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

  /** PURCHASE API (Increase stock) */
  static async purchaseProduct(productId, quantity) {
    try {
      const product = await this.getProductById(productId);

      // Update stock for purchase (Increase stock)
      const updatedProduct = {
        ...product,
        stockQuantity: product.stockQuantity + quantity,
      };

      // Update the product with new stock value
      const response = await axios.put(
        `${this.BASE_URL}/products/${productId}`,
        updatedProduct
      );

      // Create a purchase transaction
      const transaction = {
        type: "purchase",
        productId,
        quantity,
        totalPrice: product.price * quantity,
        date: new Date().toISOString(),
      };

      await this.addTransaction(transaction);
      return { success: true, updatedProduct };
    } catch (error) {
      console.error("Error purchasing product:", error);
      return { success: false, message: error.message };
    }
  }

  /** SALE API (Decrease stock) */
  static async sellProduct(productId, quantity) {
    try {
      const product = await this.getProductById(productId);

      // Check if there's enough stock to sell
      if (product.stockQuantity < quantity) {
        throw new Error("Not enough stock to sell");
      }

      // Update stock for sale (Decrease stock)
      const updatedProduct = {
        ...product,
        stockQuantity: product.stockQuantity - quantity,
      };

      // Update the product with new stock value
      const response = await axios.put(
        `${this.BASE_URL}/products/${productId}`,
        updatedProduct
      );

      // Create a sale transaction
      const transaction = {
        type: "sale",
        productId,
        quantity,
        totalPrice: product.price * quantity,
        date: new Date().toISOString(),
      };

      await this.addTransaction(transaction);
      return { success: true, updatedProduct };
    } catch (error) {
      console.error("Error selling product:", error);
      return { success: false, message: error.message };
    }
  }

  /** TRANSACTIONS API */
  static async getTransactions() {
    const response = await axios.get(`${this.BASE_URL}/transactions`);
    return response.data;
  }

  static async addTransaction(transaction) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/transactions`,
        transaction
      );
      return response.data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  /** SUPPLIERS API */
  static async getAllSuppliers() {
    try {
      const response = await axios.get(`${this.BASE_URL}/suppliers`);
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
    const user = this.getUser();
    return user ? user : null;
  }

  /** CATEGORY API */
  static async createCategory(category) {
    const response = await axios.post(`${this.BASE_URL}/categories`, category);
    return response.data;
  }

  static async getAllCategory() {
    const response = await axios.get(`${this.BASE_URL}/categories`);
    return response.data;
  }

  static async getCategoryById(categoryId) {
    const response = await axios.get(
      `${this.BASE_URL}/categories/${categoryId}`
    );
    return response.data;
  }

  static async updateCategory(categoryId, categoryData) {
    const response = await axios.put(
      `${this.BASE_URL}/categories/${categoryId}`,
      categoryData
    );
    return response.data;
  }

  static async deleteCategory(categoryId) {
    const response = await axios.delete(
      `${this.BASE_URL}/categories/${categoryId}`
    );
    return response.data;
  }
}

export default ApiService;
