import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service'; // Use AuthService for product API
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { HttpHeaders } from '@angular/common/http';
import { HostListener } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  user: any = {}; // Stores the user data
  profileImageUrl: string = ''; // Stores the URL of the user's profile image
  loading: boolean = true; // To display loading state while fetching data
  error: string = ''; // To handle any error that occurs during data fetch
  dropdownVisible: boolean = false; // Controls dropdown visibility
  products: any[] = []; // Array to store the product data
  productError: string = ''; // Error handling for product data
  groupedProducts: any[] = []; // Array to store grouped product data
  vendorsLimit: number = 3; // Limit the number of vendors to display before showing the "More" option
  selectedProducts: any[] = []; // Array to track selected products
  allSelected: boolean = false;
  //fileToUpload: any;  

  uploadedFiles: any[] = []; // Array to store uploaded files
  selectedFiles: any[] = [];
  isUploading: boolean = false;
  fileToUpload: File | null = null;
  isFileInputVisible: boolean = false; 

  // Pagination variables
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 15;

  // For editing product
  productToEdit: any = null;
  updatedProductForm!: FormGroup;

  addProductModalVisible: boolean = false;
  addProductForm!: FormGroup;
  selectedFile: File | null = null;
  availableVendors: any[] = [];
  addProductFormVisible = false;


  constructor(
    private authService: AuthService, // Inject AuthService
    private router: Router,
    private fb: FormBuilder,
  ) {}
  

  ngOnInit(): void {
    this.loadProducts(); // Load the first page of products
    this.authService.getUserData().subscribe({
      next: (userData) => {
        this.user = userData;
        this.profileImageUrl = this.user.profile_pic || '';
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching user data', err);
        this.error = 'Failed to load user data.';
        this.loading = false;
      },
    });

    // Initialize the form with empty values
    this.updatedProductForm = this.fb.group({
      product_name: ['', Validators.required],
      quantity_in_stock: ['', [Validators.required, Validators.min(0)]],
      unit_price: ['', [Validators.required, Validators.min(0)]],
      vendors: [[]], // Default as an empty array
    });

    this.addProductForm = this.fb.group({
      product_name: ['', Validators.required],
      quantity_in_stock: ['', [Validators.required, Validators.min(0)]],
      unit_price: ['', [Validators.required, Validators.min(0)]],
      vendors: [[]],
  });

  this.fetchUserFiles();
  }
  
  openAddProductModal(): void {
     this.addProductModalVisible = true;
   }
 
   closeAddProductModal(): void {
    this.addProductModalVisible = false;
    this.addProductForm.reset();
  }
  
 
 

  addNewProduct(): void {
    if (this.updatedProductForm.valid) {
      const productData = this.updatedProductForm.value;
      console.log(productData);
  
      this.authService.saveProductData(productData).subscribe({
        next: (response: any) => {
          console.log('Product added successfully:', response);
          const newProduct = response.product;
          this.products.push(newProduct); // Update local product list
  
          if (this.selectedFile) {
            const formData = new FormData();
            formData.append('product_image', this.selectedFile);
            formData.append('productId', newProduct.product_id);
  
            const token = localStorage.getItem('token');
            const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
            this.authService.uploadProductImage(formData, headers).subscribe({
              next: (uploadResponse: any) => {
                console.log('File uploaded successfully:', uploadResponse);
                newProduct.product_name_and_image.image = uploadResponse.url;
                this.groupProductsByName(); // Re-group products
                this.resetForm();
                alert('Product and image added successfully!');
              },
              error: (error) => {
                console.error('Error uploading file:', error);
                alert('Product added, but image upload failed.');
              },
            });
          } else {
            this.groupProductsByName(); // Re-group products
            this.resetForm();
            alert('Product added successfully!');
          }
        },
        error: (error) => {
          console.error('Error adding product:', error);
          alert('Failed to add product.');
        },
      });
    } else {
      console.error('Form is invalid');
      alert('Please fill in all required fields.');
    }
  }
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.isUploading = true;
      // Simulate an upload process
      setTimeout(() => {
        console.log('File uploaded:', file.name);
        this.isUploading = false;
      }, 2000);
    }
  }
  
  resetForm(): void {
    this.updatedProductForm.reset(); // Clear the form
    this.selectedFile = null; // Clear selected file
  }
  


  // Handle profile picture upload
  onUploadProfilePicture(): void {
    // Logic for uploading profile picture
    console.log('Upload profile picture clicked');
  }

  // Handle logout
  onLogout(): void {
    this.logout();  // Calls the existing logout method
  }

  // View all products
  viewAll(): void {
    console.log('View all products clicked');
    // Your logic for showing all products (maybe open a modal or navigate)
  }

  // View cart
  viewCart(): void {
    console.log('View cart clicked');
    // Your logic for viewing the cart
  }

  // Move selected products
  moveSelectedProducts(): void {
    console.log('Move selected products clicked');
    // Your logic for moving selected products
  }

  // Import data
  importData(): void {
    console.log('Import data clicked');
    // Your logic for importing data
  }

  // Download product
  /*onDownloadProduct(product: any): void {
    console.log('Download product', product);
    // Your logic for downloading product
  }

  // Delete product
  onDeleteProduct(product: any): void {
    console.log('Delete product', product);
    // Your logic for deleting product
  }*/

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return; // Prevent invalid page change
    }
    this.currentPage = page;
    this.loadProducts(page); // Call your method to load products for the new page
  }

  // Load products with pagination
  loadProducts(page: number = this.currentPage, size: number = this.pageSize): void {
    this.loading = true; // Start loading before fetching products
    this.authService.getProductDetails(page, size).subscribe({
      next: (data) => {
        this.products = data.products; // Store fetched product data
        this.groupProductsByName(); // Group the products by name
        this.totalPages = data.totalPages; // Total pages returned by the backend
        this.currentPage = data.currentPage; // Set the current page from the backend
        this.loading = false; // End loading after data is fetched
        console.log("Fetched products", this.products);
      },
      error: (err) => {
        console.error('Error fetching product details', err);
        this.productError = 'Failed to load product data.';
        this.loading = false; // End loading on error
      },
    });
  }

  // Handle Edit button click to open product editing modal
  onEditProduct(product: any): void {
    this.productToEdit = product;
    console.log('Product being edited:', product);
    // Set the product to be edited
    this.productToEdit = product;
    // Initialize the form with the product data
    this.updatedProductForm.setValue({
      product_name: product.product_name_and_image?.name,
      quantity_in_stock: product.quantity,
      unit_price: product.unit,
      vendors: product.vendors.map((vendor: any) => vendor.vendor_id),
    });
  }

  onCancelEdit(): void {
    this.productToEdit = null; // Hide the form
  }

  // Submit the edited product data
  onUpdateProduct(): void {
    if (this.updatedProductForm.invalid) {
      return; // Don't proceed if the form is invalid
    }

    if (!this.productToEdit) {
      return;
    }

    const updatedData = this.updatedProductForm.value;

    this.authService.updateProductDetails(this.productToEdit.product_id, updatedData).subscribe({
      next: () => {
        alert('Product updated successfully!');
        // Find and update the product in the local products array
        const updatedProductIndex = this.products.findIndex(product => product.product_id === this.productToEdit.product_id);
        if (updatedProductIndex !== -1) {
          this.products[updatedProductIndex] = {
            ...this.products[updatedProductIndex],
            ...updatedData,
            product_name_and_image: {
              ...this.products[updatedProductIndex].product_name_and_image,
              name: updatedData.product_name,
            },
            vendors: updatedData.vendors || this.products[updatedProductIndex].vendors, // Update vendors if needed
            unit: updatedData.unit_price, // Assuming unit price is the same as the unit
            quantity: updatedData.quantity_in_stock, // Update quantity
          };
        }

        // Re-group the products after the update
        this.groupProductsByName();

        this.productToEdit = null; // Reset the product being edited
        this.updatedProductForm.reset();
      },
      error: (err) => {
        console.error('Error updating product', err);
        alert('Failed to update product.');
      },
    });
  }

  groupProductsByName() {
    // Filter out products that are deleted (status === 99)
    const filteredProducts = this.products.filter((product) => product.status !== 99);

    // Group products by their name and image
    const grouped = filteredProducts.reduce((acc, product) => {
      const productNameWithImage = product.product_name_and_image?.name || 'Unnamed Product';
      const productImageUrl = product.product_name_and_image?.image || 'assets/default-product-image.jpg';

      // Ensure product has valid category array
      const categories = product.category ? [product.category] : [];  // Fallback if no category exists

      categories.forEach((category: string) => {
        if (!acc[productNameWithImage]) {
          acc[productNameWithImage] = [];
        }

        // Add product with its category to the accumulator
        acc[productNameWithImage].push({
          ...product,         // Copy all product properties
          category,           // Add the current category to the product
          product_name_and_image_combined: {
            name: productNameWithImage,
            image: productImageUrl
          },
          vendors: product.vendors || []  // Ensure vendors is always an array
        });
      });

      return acc;
    }, {});

    console.log('Grouping products', grouped);

    // Convert the grouped object to an array format for display in the template
    this.groupedProducts = Object.keys(grouped).map((productName) => ({
      productName,
      products: grouped[productName],
    }));
  }

  onCheckboxChange(event: any, product: any): void {
    if (event.target.checked) {
      product.selected = true;
      this.selectedProducts.push(product);
    } else {
      product.selected = false;
      const index = this.selectedProducts.findIndex(p => p.product_id === product.product_id);
      if (index !== -1) {
        this.selectedProducts.splice(index, 1);
      }
    }
  }

  // Handle header checkbox change (select all or deselect all)
  onHeaderCheckboxChange(event: any): void {
    this.allSelected = event.target.checked;
    this.products.forEach(product => {
      product.selected = this.allSelected;
      if (this.allSelected) {
        if (!this.selectedProducts.includes(product)) {
          this.selectedProducts.push(product);
        }
      } else {
        this.selectedProducts = [];
      }
    });
  }

  // Download selected products as Excel
  downloadExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.selectedProducts);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Products': worksheet },
      SheetNames: ['Products']
    };
    XLSX.writeFile(workbook, 'selected_products.xlsx');
  }

  // Download all selected products
  downloadAllSelected(): void {
    if (this.selectedProducts.length === 0) {
      alert('No products selected for download.');
      return;
    }

    // Call your service method to trigger the download (e.g., download selected products)
    this.downloadExcel();
  }
  onDownloadProduct(product: any): void {
    this.authService.downloadProductAsPdf(product); // Call the service to generate PDF
  }
  
  onDeleteProduct(product: any): void {
    console.log('Deleting product with ID:', product.id);
    const confirmation = confirm('Are you sure you want to delete this product?');
    if (confirmation) {
      this.authService.deleteProduct(product.product_id).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.loadProducts(); // Reload the product list after deletion
        },
        error: (err) => {
          console.error('Error deleting product', err);
          alert('Failed to delete product.');
        },
      });
    }
  }

  fetchUserFiles(): void {
    this.authService.getUserFiles().subscribe({
      next: (response: any) => {
        this.uploadedFiles = response.files;
      },
      error: (err) => {
        console.error('Failed to fetch user files', err);
        alert('Error fetching uploaded files.');
      },
    });
  }

  // Handle file selection
  onFileSelect(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      this.fileToUpload = fileInput.files[0];

      
    }
  }

  // Upload selected file
  uploadFile(): void {
    if (!this.fileToUpload) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.fileToUpload);

    this.authService.uploadFile(formData).subscribe({
      next: () => {
        alert('File uploaded successfully!');
        this.fetchUserFiles(); // Refresh the file list
        this.fileToUpload = null; // Reset the file input
      },
      error: (err) => {
        console.error('File upload failed', err);
        alert('Error uploading file.');
      },
    });
  }

  // Handle checkbox change for individual files
  onIndividualCheckboxChange(event: any, file: any): void {
    if (event.target.checked) {
      this.selectedFiles.push(file);
    } else {
      this.selectedFiles = this.selectedFiles.filter(f => f !== file);
    }
  }

  // Handle "Select All" checkbox
  onToggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedFiles = [...this.uploadedFiles];  // Select all
    } else {
      this.selectedFiles = [];  // Deselect all
    }
  }

  // Download selected files
  downloadSelectedFiles() {
    this.selectedFiles.forEach(file => {
      // Logic for downloading selected files (e.g., triggering download based on file.file_url)
      const link = document.createElement('a');
      link.href = file.file_url;
      link.download = file.file_name;
      link.click();
    });
  

    this.selectedFiles.forEach(file => {
      this.authService.downloadFile(file.file_url).subscribe({
        next: (blob: Blob) => {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = file.file_name;
          a.click();
          URL.revokeObjectURL(objectUrl);
        },
        error: (err) => {
          console.error('Error downloading file', err);
          alert(`Failed to download file: ${file.file_name}`);
        },
      });
    });
    
  }

  @HostListener('document:click', ['$event.target'])
  onOutsideClick(target: HTMLElement) {
    if (!target.closest('.dropdown-menu') && !target.closest('.user-info')) {
      this.dropdownVisible = false;
    }
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  toggleAddProductForm() {
    this.addProductModalVisible = !this.addProductModalVisible;
  }
  toggleFileInput() {
    this.isFileInputVisible = !this.isFileInputVisible;
  }

  logout(): void {
    this.authService.logout(); // Just call logout without subscribing to it
    this.router.navigate(['/login']); // Navigate to the login page after logging out
  }
}  
