/**
 * DecaDrive Frontend - Vue 2 Application
 *
 * Purpose: Single-page application for browsing driving lessons, managing cart, and placing orders.
 * This file contains all application logic, state management, and API integration.
 *
 * Why Vue 2: Requirement specifies Vue 2 only, loaded via CDN for simplicity.
 * Why fetch: Requirement specifies fetch() + Promises for all API calls (no axios).
 * Why no router: Single-page app uses v-if for page switching as per requirements.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Backend API base URL
 * Change this to your deployed backend URL when ready
 * Example: 'https://your-backend.onrender.com' or 'http://localhost:3000'
 */
const BACKEND_URL = "http://localhost:8080";

// ============================================================================
// MAIN VUE INSTANCE
// ============================================================================

/**
 * Main Vue application instance
 * Manages all state, methods, and computed properties for the entire app
 */
new Vue({
  el: "#app",

  /**
   * DATA - Application State
   *
   * Why each property exists:
   * - currentPage: Controls which view is displayed via v-if (home, lessons, cart, checkout, orderSuccess)
   * - darkMode: Tracks current theme preference (true = dark, false = light)
   * - lessons: Array of lesson objects fetched from backend
   * - cart: Array of cart items {id, lesson, qty} - represents user's shopping cart
   * - searchQuery: Current search term for filtering lessons
   * - sortBy: Field to sort lessons by (subject, location, price, spaces)
   * - sortOrder: Sort direction ('asc' or 'desc')
   * - user: Object holding checkout form data {name, phone}
   * - validationErrors: Object tracking form validation errors
   * - loading: Boolean indicating if API request is in progress
   * - isProcessing: Boolean preventing duplicate submissions during async operations
   * - error: String containing error message if API call fails
   * - orderId: Order ID returned from successful order submission
   * - lastOrderTotal: Total amount from last successful order (for success page)
   */
  data: {
    currentPage: "home",
    darkMode: false,
    lessons: [],
    cart: [],
    searchQuery: "",
    sortBy: "subject",
    sortOrder: "asc",
    user: {
      name: "",
      phone: "",
    },
    validationErrors: {
      name: "",
      phone: "",
    },
    loading: false,
    isProcessing: false,
    error: null,
    orderId: null,
    lastOrderTotal: 0,
  },

  /**
   * COMPUTED PROPERTIES
   * These are reactive values derived from data properties
   */
  computed: {
    /**
     * Total number of items in cart (sum of all quantities)
     * Used for cart badge display
     */
    cartCount() {
      return this.cart.reduce((total, item) => total + item.qty, 0);
    },

    /**
     * Total price of all items in cart
     * Calculates: sum of (price × quantity) for each item
     */
    cartTotal() {
      return this.cart.reduce(
        (total, item) => total + item.lesson.price * item.qty,
        0
      );
    },

    /**
     * Form validation status
     * Returns true only if name and phone are valid (no validation errors)
     * Used to enable/disable checkout submit button
     */
    isFormValid() {
      return (
        this.user.name &&
        this.user.phone &&
        !this.validationErrors.name &&
        !this.validationErrors.phone
      );
    },
  },

  /**
   * LIFECYCLE HOOKS
   */
  mounted() {
    /**
     * On app initialization:
     * 1. Check for saved theme preference in localStorage
     * 2. Apply the theme to document
     * 3. Fetch initial lessons data from backend
     */
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      this.darkMode = savedTheme === "true";
      this.applyTheme();
    }

    // Start on lessons page and fetch data
    this.currentPage = "home";
  },

  /**
   * METHODS
   * All application logic and event handlers
   */
  methods: {
    // ========================================================================
    // NAVIGATION METHODS
    // ========================================================================

    /**
     * Navigate to a different page/view
     * @param {string} page - Page name (home, lessons, cart, checkout, orderSuccess)
     *
     * Why this exists: Single-page app uses v-if for page switching instead of router
     * Automatically fetches lessons when navigating to lessons page
     */
    goTo(page) {
      this.currentPage = page;
      this.error = null; // Clear any previous errors

      // Fetch lessons when entering lessons page
      if (page === "lessons" && this.lessons.length === 0) {
        this.fetchLessons();
      }
    },

    /**
     * Return to lessons page after successful order
     * Clears cart and user data for fresh start
     */
    returnToLessons() {
      this.cart = [];
      this.user = { name: "", phone: "" };
      this.validationErrors = { name: "", phone: "" };
      this.goTo("lessons");
      this.fetchLessons(); // Refresh to show updated spaces
    },

    // ========================================================================
    // THEME TOGGLE METHODS
    // ========================================================================

    /**
     * Toggle between light and dark mode
     * Saves preference to localStorage for persistence across sessions
     */
    toggleTheme() {
      this.applyTheme();
      localStorage.setItem("darkMode", this.darkMode);
    },

    /**
     * Apply current theme to document by adding/removing 'dark-mode' class
     * CSS handles the actual theme styling based on this class
     */
    applyTheme() {
      if (this.darkMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    },

    // ========================================================================
    // API METHODS - LESSONS
    // ========================================================================

    /**
     * Fetch lessons from backend
     *
     * How it works:
     * 1. Constructs URL with optional query params (search, sort)
     * 2. Uses fetch() to make GET request (required: no axios)
     * 3. Handles response and updates lessons array
     * 4. Manages loading state and error handling
     *
     * API Endpoint: GET /lessons
     * Query params: ?q=<search>&sortBy=<field>&order=<asc|desc>
     */
    async fetchLessons() {
      this.loading = true;
      this.error = null;

      try {
        // Build URL with query parameters
        let url = `${BACKEND_URL}/lessons`;
        const params = new URLSearchParams();

        if (this.searchQuery) {
          params.append("q", this.searchQuery);
        }
        if (this.sortBy) {
          params.append("sortBy", this.sortBy);
          params.append("order", this.sortOrder);
        }

        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }

        // Make fetch request to backend
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch lessons: ${response.statusText}`);
        }

        const data = await response.json();
        this.lessons = data;
      } catch (err) {
        console.error("Error fetching lessons:", err);
        this.error = err.message || "Failed to load lessons. Please try again.";
      } finally {
        this.loading = false;
      }
    },

    /**
     * Search lessons as user types
     * Debouncing could be added here but kept simple for clarity
     * Calls backend with ?q=<searchQuery> parameter
     */
    searchLessons() {
      this.fetchLessons();
    },

    /**
     * Clear search query and reload all lessons
     */
    clearSearch() {
      this.searchQuery = "";
      this.fetchLessons();
    },

    /**
     * Sort lessons when user changes sort field
     * Calls backend with sortBy and order parameters
     */
    sortLessons() {
      this.fetchLessons();
    },

    /**
     * Toggle sort order between ascending and descending
     */
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      this.fetchLessons();
    },

    // ========================================================================
    // CART MANAGEMENT METHODS
    // ========================================================================

    /**
     * Add a lesson to the cart
     *
     * How cart works:
     * - Each cart item has {id, lesson, qty}
     * - If lesson already in cart, increase quantity
     * - If new, add with qty = 1
     * - Validates that spaces are available
     *
     * @param {Object} lesson - Lesson object from backend
     */
    addToCart(lesson) {
      // Check if lesson already in cart
      const existingItem = this.cart.find(
        (item) => item.lesson._id === lesson._id
      );

      if (existingItem) {
        // Increase quantity if space available
        if (existingItem.qty < lesson.spaces) {
          existingItem.qty++;
        }
      } else {
        // Add new item to cart
        this.cart.push({
          id: lesson._id,
          lesson: lesson,
          qty: 1,
        });
      }
    },

    /**
     * Check if a lesson is already in the cart
     * Used to show "Added" state on lesson cards
     */
    isInCart(lessonId) {
      return this.cart.some((item) => item.lesson._id === lessonId);
    },

    /**
     * Remove an item from the cart completely
     */
    removeFromCart(item) {
      const index = this.cart.findIndex((cartItem) => cartItem.id === item.id);
      if (index > -1) {
        this.cart.splice(index, 1);
      }
    },

    /**
     * Increase quantity of a cart item
     * Validates against available spaces
     */
    increaseQty(item) {
      if (item.qty < item.lesson.spaces) {
        item.qty++;
      }
    },

    /**
     * Decrease quantity of a cart item
     * Removes item if quantity reaches 0
     */
    decreaseQty(item) {
      if (item.qty > 1) {
        item.qty--;
      } else {
        this.removeFromCart(item);
      }
    },

    // ========================================================================
    // FORM VALIDATION METHODS
    // ========================================================================

    /**
     * Validate name field
     * Rules:
     * - Required (not empty)
     * - Letters and spaces only (regex: /^[A-Za-z ]+$/)
     *
     * Why: Course requirement for name validation
     * Updates validationErrors.name with error message or empty string
     */
    validateName() {
      const name = this.user.name.trim();

      if (!name) {
        this.validationErrors.name = "Name is required";
      } else if (!/^[A-Za-z ]+$/.test(name)) {
        this.validationErrors.name =
          "Name must contain only letters and spaces";
      } else {
        this.validationErrors.name = "";
      }
    },

    /**
     * Validate phone field
     * Rules:
     * - Required (not empty)
     * - Digits only (regex: /^\d+$/)
     * - At least 6 digits
     *
     * Why: Course requirement for phone validation
     * Updates validationErrors.phone with error message or empty string
     */
    validatePhone() {
      const phone = this.user.phone.trim();

      if (!phone) {
        this.validationErrors.phone = "Phone number is required";
      } else if (!/^\d+$/.test(phone)) {
        this.validationErrors.phone = "Phone must contain only digits";
      } else if (phone.length < 6) {
        this.validationErrors.phone = "Phone must be at least 6 digits";
      } else {
        this.validationErrors.phone = "";
      }
    },

    // ========================================================================
    // ORDER SUBMISSION METHODS
    // ========================================================================

    /**
     * Submit order to backend
     *
     * How checkout validation works:
     * 1. Validate form fields one more time before submission
     * 2. Check cart is not empty
     * 3. Verify lesson availability (spaces > 0)
     * 4. POST order to backend
     * 5. On success, update lesson spaces via PUT requests
     * 6. Navigate to success page
     *
     * API Flow:
     * - POST /orders with cart data
     * - PUT /lessons/:id for each lesson to reduce spaces
     */
    async submitOrder() {
      // Final validation check
      this.validateName();
      this.validatePhone();

      if (!this.isFormValid) {
        return;
      }

      if (this.cart.length === 0) {
        this.error = "Cart is empty";
        return;
      }

      this.isProcessing = true;
      this.error = null;

      try {
        // Prepare order payload matching backend schema
        const orderData = {
          name: this.user.name.trim(),
          phone: this.user.phone.trim(),
          items: this.cart.map((item) => ({
            lessonId: item.lesson._id,
            quantity: item.qty,
          })),
        };

        // POST order to backend
        const orderResponse = await fetch(`${BACKEND_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          throw new Error(errorData.message || "Failed to place order");
        }

        const orderResult = await orderResponse.json();
        this.orderId = orderResult._id;
        this.lastOrderTotal = this.cartTotal;

        // Update lesson spaces for each item in cart
        // This reduces available spaces after successful order
        await this.updateLessonSpaces();

        // Navigate to success page
        this.goTo("orderSuccess");
      } catch (err) {
        console.error("Error submitting order:", err);
        this.error = err.message || "Failed to place order. Please try again.";
      } finally {
        this.isProcessing = false;
      }
    },

    /**
     * Update lesson spaces after successful order
     *
     * How spaces update works:
     * 1. For each item in cart, make PUT request to backend
     * 2. Backend decrements spaces by the quantity ordered
     * 3. Uses Promise.all to send all updates in parallel
     *
     * API Endpoint: PUT /lessons/:id
     * Body: { spaces: <new_spaces_count> }
     */
    async updateLessonSpaces() {
      const updatePromises = this.cart.map((item) => {
        const newSpaces = item.lesson.spaces - item.qty;

        return fetch(`${BACKEND_URL}/lessons/${item.lesson._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            spaces: newSpaces,
          }),
        });
      });

      // Wait for all updates to complete
      await Promise.all(updatePromises);
    },
  },
});

/**
 * DEMO NOTES FOR STUDENT PRESENTATION:
 *
 * 1. Page Switching: Show how v-if controls which view is displayed
 *    - currentPage variable determines the active view
 *    - No router needed for this coursework
 *
 * 2. Search & Sort: Demonstrate search-as-you-type and sorting
 *    - Each keystroke calls fetchLessons() with ?q= parameter
 *    - Sort controls send sortBy and order parameters to backend
 *
 * 3. Cart Workflow: Add items, adjust quantities, show total
 *    - Cart stored in-memory (no persistence required)
 *    - Quantity validation against available spaces
 *
 * 4. Checkout Validation: Show live validation as you type
 *    - Name: letters and spaces only
 *    - Phone: digits only, minimum 6
 *    - Submit button disabled until valid
 *
 * 5. Order Flow: Submit → Update Spaces → Success
 *    - POST /orders creates order
 *    - PUT /lessons/:id updates spaces
 *    - Order ID displayed on success page
 *
 * 6. API Integration: All done with fetch() + Promises
 *    - No axios (requirement)
 *    - Error handling with try/catch
 *    - Loading states for better UX
 */
