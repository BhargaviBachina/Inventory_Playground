import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken';
  private authApiUrl = 'http://localhost:3000/v1/auth'; 
  private profileApiUrl = 'http://localhost:3000/v1/profile'; 
  private productApiUrl = 'http://localhost:3000/v1/products';
  private baseUrl = 'http://localhost:3000/v1/vendors';

  constructor(private http: HttpClient) {}

  // Check if the username exists
  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.authApiUrl}/check-username/${username}`);
  }

  // Login user
  login(data: { usernameOrEmail: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/login`, data);
  }

  // Register user
  register(data: { first_name: string; username: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/register`, data);
  }

  // Save token to local storage
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Clear token from local storage
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken(); 
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  // Upload profile picture
  uploadProfilePicture(data: FormData): Observable<any> {
    return this.http.post(`${this.profileApiUrl}/upload-profile-picture`, data, {
      headers: { Authorization: `Bearer ${this.getToken()}` }, // Include token in the request headers
    });
  }

  // Logout user (no observable needed for this)
  logout(): void {
    this.clearToken(); // Remove the token from local storage
  }

  // Fetch product details with pagination
  getProductDetails(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.productApiUrl}`, { params });
  }

  // Fetch user data (with token authorization)
  getUserData(): Observable<any> {
    const token = this.getToken();
    if (token) {
      return this.http.get<any>(`${this.authApiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      return new Observable((observer) => {
        observer.next({});
        observer.complete();
      });
    }
  }

  // Update product details
  updateProductDetails(productId: number, updatedProductData: any): Observable<any> {
    const url = `${this.productApiUrl}/updateProduct/${productId}`;
    return this.http.put<any>(url, updatedProductData);
  }

  // Delete product by ID
  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.productApiUrl}/${productId}`);
  }

  // Download product details as a PDF
  downloadProductAsPdf(product: any): void {
    const { jsPDF } = require('jspdf');
    const doc = new jsPDF();
    
    const productName = product.product_name_and_image?.name || 'Unnamed Product';
    const category = product.category || 'No category';
    const price = product.unit || 'N/A';
    const quantity = product.quantity || 0;
    const vendors = product.vendors ? product.vendors.join(', ') : 'No vendors';
    const status = product.status === 1 ? 'Active' : 'Inactive';

    // Add product details to the PDF
    doc.text(`Product Name: ${productName}`, 10, 10);
    doc.text(`Category: ${category}`, 10, 20);
    doc.text(`Price: ${price}`, 10, 30);
    doc.text(`Quantity: ${quantity}`, 10, 40);
    doc.text(`Vendors: ${vendors}`, 10, 50);
    doc.text(`Status: ${status}`, 10, 60);
    
    // Save the PDF with the product name
    doc.save(`${productName}.pdf`);
  }

  // Download multiple products as a blob
  downloadProducts(products: any[]): Observable<Blob> {
    const productIds = products.map(product => product.product_id); // Extract product IDs
    return this.http.post<Blob>(`${this.productApiUrl}/download-products`, { productIds }, { responseType: 'blob' as 'json' });
  }

  saveProductData(productData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save-product`, productData);
  }
  
  uploadProductImage(formData: FormData, headers: HttpHeaders): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload-image`, formData, { headers });
  }

  uploadFile(formData: FormData) {
    return this.http.post('/upload-file', formData); // Adjust URL if needed
  }

  getUserFiles() {
    return this.http.get('/user-files');
  }

  downloadFile(fileUrl: string) {
    return this.http.get(fileUrl, { responseType: 'blob' });
  }

  
  
}
