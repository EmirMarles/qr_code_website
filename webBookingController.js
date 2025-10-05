const Business = require('../models/Business');
const Client = require('../models/Client');
const Appointment = require('../models/Appointment');

/**
 * Display web booking form for unregistered clients
 * GET /api/booking/:businessId
 */
exports.showBookingForm = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { qr: qrCodeId } = req.query;

    // Get business data with services and staff
    const business = await Business.findById(businessId)
      .populate({
        path: 'services',
        populate: {
          path: 'staff',
          select: '_id fullName'
        }
      })
      .populate({
        path: 'staff',
        populate: {
          path: 'services',
          select: '_id name price duration'
        }
      })
      .select('name description phone address location services staff');

    if (!business) {
      return res.status(404).send(`
        <html>
          <head><title>Business Not Found</title></head>
          <body style="font-family: Arial; text-align: center; margin-top: 50px;">
            <h2>Business Not Found</h2>
            <p>The business you're looking for doesn't exist.</p>
          </body>
        </html>
      `);
    }

    // Filter active services and staff
    const activeServices = business.services.filter(service => 
      service.isActive !== false
    );
    const activeStaff = business.staff.filter(staff => 
      staff.isActive !== false
    );

    const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <title>Запись на прием - ${business.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5; 
      color: #333;
      line-height: 1.6;
    }
    .container { 
      max-width: 500px; 
      margin: 0 auto; 
      padding: 20px;
      background: white;
      min-height: 100vh;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #004242;
    }
    .header h1 {
      color: #004242;
      font-size: 24px;
      margin-bottom: 10px;
    }
    .header p {
      color: #666;
      font-size: 16px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }
    input, select, textarea {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-color: white;
    }
    select {
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      padding-right: 40px;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #004242;
    }
    .btn {
      background: #004242;
      color: white;
      padding: 15px 30px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      transition: background 0.3s;
    }
    .btn:hover {
      background: #003333;
    }
    .btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .loading {
      display: none;
      text-align: center;
      padding: 20px;
      color: #666;
    }
    .success {
      display: none;
      text-align: center;
      padding: 20px;
      background: #d4edda;
      color: #155724;
      border-radius: 8px;
      margin: 20px 0;
    }
    .error {
      display: none;
      text-align: center;
      padding: 20px;
      background: #f8d7da;
      color: #721c24;
      border-radius: 8px;
      margin: 20px 0;
    }
    .required {
      color: #e74c3c;
    }
    .business-info {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .business-info h3 {
      color: #004242;
      margin-bottom: 10px;
    }
    .business-info p {
      margin: 5px 0;
      color: #666;
    }
    
    /* Custom Dropdown Styles */
    .custom-dropdown {
      position: relative;
      width: 100%;
    }
    
    .dropdown-trigger {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      background-color: white;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: border-color 0.3s;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    
    .dropdown-trigger:hover {
      border-color: #004242;
    }
    
    .dropdown-trigger.active {
      border-color: #004242;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
    
    .dropdown-text {
      flex: 1;
      text-align: left;
    }
    
    .dropdown-arrow {
      font-size: 12px;
      transition: transform 0.3s;
      color: #666;
    }
    
    .dropdown-trigger.active .dropdown-arrow {
      transform: rotate(180deg);
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 2px solid #004242;
      border-top: none;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
      display: none;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .dropdown-menu.show {
      display: block;
    }
    
    .dropdown-item {
      padding: 12px;
      cursor: pointer;
      border-bottom: 1px solid #eee;
      transition: background-color 0.2s;
    }
    
    .dropdown-item:hover {
      background-color: #f8f9fa;
    }
    
    .dropdown-item:last-child {
      border-bottom: none;
    }
    
    .dropdown-item.selected {
      background-color: #004242;
      color: white;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${business.name}</h1>
      <p>Запись на прием</p>
    </div>

    <div class="business-info">
      <h3>Информация о бизнесе</h3>
      ${business.description ? '<p><strong>Описание:</strong> ' + business.description + '</p>' : ''}
      ${business.phone ? '<p><strong>Телефон:</strong> ' + business.phone + '</p>' : ''}
      ${business.address ? '<p><strong>Адрес:</strong> ' + business.address + '</p>' : ''}
    </div>

    <div id="booking-form">
      <form id="appointmentForm">
        <div class="form-group">
          <label for="customerName">Ваше имя <span class="required">*</span></label>
          <input type="text" id="customerName" name="customerName" required>
        </div>

        <div class="form-group">
          <label for="customerPhone">Номер телефона <span class="required">*</span></label>
          <input type="tel" id="customerPhone" name="customerPhone" placeholder="+998901234567" required>
        </div>

        <div class="form-group">
          <label for="staffId">Мастер <span class="required">*</span></label>
          <div class="custom-dropdown" id="staffDropdown">
            <div class="dropdown-trigger" id="staffTrigger">
              <span class="dropdown-text">Выберите мастера</span>
              <span class="dropdown-arrow">▼</span>
            </div>
            <div class="dropdown-menu" id="staffMenu">
              ${activeStaff.map(staff => 
                '<div class="dropdown-item" data-value="' + staff._id + '">' + (staff.fullName || staff.name || 'Мастер') + ' - ' + (staff.position || '') + '</div>'
              ).join('')}
            </div>
            <input type="hidden" id="staffId" name="staffId" required>
          </div>
        </div>

        <div class="form-group">
          <label for="serviceId">Услуга <span class="required">*</span></label>
          <div class="custom-dropdown" id="serviceDropdown">
            <div class="dropdown-trigger" id="serviceTrigger">
              <span class="dropdown-text">Сначала выберите мастера</span>
              <span class="dropdown-arrow">▼</span>
            </div>
            <div class="dropdown-menu" id="serviceMenu">
              <!-- Services will be populated dynamically based on selected staff -->
            </div>
            <input type="hidden" id="serviceId" name="serviceId" required>
          </div>
        </div>

        <div class="form-group">
          <label for="date">Дата <span class="required">*</span></label>
          <input type="date" id="date" name="date" required>
        </div>

        <div class="form-group">
          <label for="time">Время <span class="required">*</span></label>
          <select id="time" name="time" required>
            <option value="">Сначала выберите дату и мастера</option>
          </select>
        </div>

        <div class="form-group">
          <label for="notes">Примечания (необязательно)</label>
          <textarea id="notes" name="notes" rows="3" placeholder="Дополнительная информация..."></textarea>
        </div>

        <button type="submit" class="btn">Записаться на прием</button>
      </form>
    </div>

    <div id="loading" class="loading">
      <p>Создаем запись...</p>
    </div>

    <div id="success" class="success">
      <h3>Запись создана успешно!</h3>
      <p>Мы свяжемся с вами для подтверждения.</p>
    </div>

    <div id="error" class="error">
      <h3>Ошибка при создании записи</h3>
      <p id="errorMessage"></p>
    </div>
  </div>

  <script src="/api/booking-script/${businessId}"></script>
</body>
</html>
    `;

    res.set({
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.send(html);

  } catch (error) {
    console.error('❌ Show booking form error:', error);
    res.status(500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial; text-align: center; margin-top: 50px;">
          <h2>Something went wrong</h2>
          <p>Please try again later.</p>
        </body>
      </html>
    `);
  }
};

/**
 * Serve external JavaScript for web booking form
 * GET /api/booking-script/:businessId
 */
exports.getBookingScript = async (req, res) => {
  try {
    const { businessId } = req.params;

    // Get business data with services and staff
    const business = await Business.findById(businessId)
      .populate('services')
      .populate('staff')
      .select('name services staff');

    if (!business) {
      return res.status(404).send('// Business not found');
    }

    // Filter active services and staff
    const activeServices = business.services.filter(service => 
      service.isActive !== false
    );
    const activeStaff = business.staff.filter(staff => 
      staff.isActive !== false
    );

    const jsContent = `
const businessId = '${businessId}';
const activeServices = ${JSON.stringify(activeServices)};
const activeStaff = ${JSON.stringify(activeStaff)};

// Function to populate services based on selected staff
function populateServicesForStaff(staffId) {
  const serviceDropdown = document.getElementById('serviceMenu');
  const serviceTrigger = document.getElementById('serviceTrigger');
  const serviceText = serviceTrigger.querySelector('.dropdown-text');
  const serviceInput = document.getElementById('serviceId');
  
  // Clear current services
  serviceDropdown.innerHTML = '';
  serviceInput.value = '';
  serviceText.textContent = 'Загрузка услуг...';
  
  if (!staffId) {
    serviceText.textContent = 'Сначала выберите мастера';
    return;
  }
  
  // Fetch services for this staff member from API
  fetch('/api/booking/' + businessId + '/services/' + staffId)
    .then(response => response.json())
    .then(data => {
      if (data.success && data.services && data.services.length > 0) {
        serviceText.textContent = 'Выберите услугу';
        
        // Populate services for this staff member
        data.services.forEach(service => {
          const serviceItem = document.createElement('div');
          serviceItem.className = 'dropdown-item';
          serviceItem.setAttribute('data-value', service._id);
          serviceItem.textContent = service.name + ' - ' + (service.price ? service.price + ' сум' : '') + ' - ' + (service.duration ? service.duration + ' мин' : '');
          serviceDropdown.appendChild(serviceItem);
        });
        
        // Re-initialize dropdown functionality for new items
        initializeServiceDropdown();
      } else {
        serviceText.textContent = 'У мастера нет доступных услуг';
      }
    })
    .catch(error => {
      console.error('Error loading services:', error);
      serviceText.textContent = 'Ошибка загрузки услуг';
    });
}

// Function to initialize service dropdown specifically
function initializeServiceDropdown() {
  const serviceDropdown = document.getElementById('serviceDropdown');
  const serviceTrigger = serviceDropdown.querySelector('.dropdown-trigger');
  const serviceMenu = serviceDropdown.querySelector('.dropdown-menu');
  const serviceInput = serviceDropdown.querySelector('input[type="hidden"]');
  const serviceText = serviceTrigger.querySelector('.dropdown-text');
  const serviceItems = serviceMenu.querySelectorAll('.dropdown-item');
  
  // Remove existing event listeners by cloning the elements
  const newTrigger = serviceTrigger.cloneNode(true);
  const newMenu = serviceMenu.cloneNode(true);
  serviceTrigger.parentNode.replaceChild(newTrigger, serviceTrigger);
  serviceMenu.parentNode.replaceChild(newMenu, serviceMenu);
  
  // Add new event listeners
  newTrigger.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Close other dropdowns
    document.querySelectorAll('.custom-dropdown').forEach(otherDropdown => {
      if (otherDropdown !== serviceDropdown) {
        otherDropdown.querySelector('.dropdown-trigger').classList.remove('active');
        otherDropdown.querySelector('.dropdown-menu').classList.remove('show');
      }
    });
    
    // Toggle current dropdown
    newTrigger.classList.toggle('active');
    newMenu.classList.toggle('show');
  });
  
  // Handle service item selection
  newMenu.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const value = this.getAttribute('data-value');
      const text = this.textContent;
      
      // Update hidden input
      serviceInput.value = value;
      
      // Update display text
      newTrigger.querySelector('.dropdown-text').textContent = text;
      
      // Mark item as selected
      newMenu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
      this.classList.add('selected');
      
      // Close dropdown
      newTrigger.classList.remove('active');
      newMenu.classList.remove('show');
      
      // Trigger change event
      serviceInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      console.log('Service selected:', { value, text });
    });
  });
}

// Set minimum date to today
document.addEventListener('DOMContentLoaded', function() {
  const dateInput = document.getElementById('date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }
});

// Load available slots when service, staff, and date are selected
function loadAvailableSlots() {
  const serviceId = document.getElementById('serviceId').value;
  const staffId = document.getElementById('staffId').value;
  const date = document.getElementById('date').value;
  const timeSelect = document.getElementById('time');

  if (!serviceId || !staffId || !date) {
    timeSelect.innerHTML = '<option value="">Сначала выберите услугу, мастера и дату</option>';
    return;
  }

  // Validate date format (should be YYYY-MM-DD)
  const dateRegex = new RegExp('^\\\\d{4}-\\\\d{2}-\\\\d{2}$');
  if (!dateRegex.test(date)) {
    console.error('❌ Invalid date format:', date);
    timeSelect.innerHTML = '<option value="">Неверный формат даты</option>';
    return;
  }

  // Check if date is in the future (should not be allowed)
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  if (selectedDate < today) {
    console.error('❌ Date is in the past:', date);
    timeSelect.innerHTML = '<option value="">Дата не может быть в прошлом</option>';
    return;
  }



  timeSelect.innerHTML = '<option value="">Загрузка времени...</option>';

  // Call getAvailableSlots API
  const apiUrl = '/api/available-slots?businessId=' + businessId + '&date=' + date + '&staffId=' + staffId + '&serviceId=' + serviceId;




  fetch(apiUrl)
    .then(response => {

      return response.json();
    })
    .then(data => {

      if (data.availableSlots && data.availableSlots.length > 0) {
        timeSelect.innerHTML = '<option value="">Выберите время</option>' + 
          data.availableSlots.map(slot => {
            const time = typeof slot === 'string' ? slot : slot.startTime;
            return '<option value="' + time + '">' + time + '</option>';
          }).join('');
      } else {
        timeSelect.innerHTML = '<option value="">Нет доступного времени</option>';
      }
    })
    .catch(error => {
      console.error('❌ Error loading available slots:', error);
      timeSelect.innerHTML = '<option value="">Ошибка загрузки времени</option>';
    });
}

// Custom Dropdown Functionality
function initializeCustomDropdowns() {
  const dropdowns = document.querySelectorAll('.custom-dropdown');
  
  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const menu = dropdown.querySelector('.dropdown-menu');
    const hiddenInput = dropdown.querySelector('input[type="hidden"]');
    const textSpan = trigger.querySelector('.dropdown-text');
    const items = menu.querySelectorAll('.dropdown-item');
    
    // Toggle dropdown
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Close other dropdowns
      dropdowns.forEach(otherDropdown => {
        if (otherDropdown !== dropdown) {
          otherDropdown.querySelector('.dropdown-trigger').classList.remove('active');
          otherDropdown.querySelector('.dropdown-menu').classList.remove('show');
        }
      });
      
      // Toggle current dropdown
      trigger.classList.toggle('active');
      menu.classList.toggle('show');
    });
    
    // Handle item selection
    items.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const value = this.getAttribute('data-value');
        const text = this.textContent;
        
        // Update hidden input
        hiddenInput.value = value;
        
        // Update display text
        textSpan.textContent = text;
        
        // Mark item as selected
        items.forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
        
        // Close dropdown
        trigger.classList.remove('active');
        menu.classList.remove('show');
        
        // Trigger change event for compatibility
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log('Dropdown selection:', { value, text });
      });
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-dropdown')) {
      dropdowns.forEach(dropdown => {
        dropdown.querySelector('.dropdown-trigger').classList.remove('active');
        dropdown.querySelector('.dropdown-menu').classList.remove('show');
      });
    }
  });
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize custom dropdowns first
  initializeCustomDropdowns();
  
  const serviceInput = document.getElementById('serviceId');
  const staffInput = document.getElementById('staffId');
  const dateInput = document.getElementById('date');

  if (serviceInput) {
    serviceInput.addEventListener('change', function() {
      console.log('Service changed:', this.value);
      loadAvailableSlots();
    });
  }

  if (dateInput) {
    dateInput.addEventListener('change', function() {
      console.log('Date changed:', this.value);
      loadAvailableSlots();
    });
  }

  if (staffInput) {
    staffInput.addEventListener('change', function() {
      console.log('Staff changed:', this.value);
      populateServicesForStaff(this.value);
      loadAvailableSlots();
    });
  }

  // Form submission
  const form = document.getElementById('appointmentForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());
      
      // Validation
      if (!data.customerName || !data.customerPhone || !data.serviceId || !data.date || !data.time) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
      }
      
      if (!data.staffId) {
        alert('Пожалуйста, выберите мастера');
        return;
      }
      
      // Show loading
      document.getElementById('booking-form').style.display = 'none';
      document.getElementById('loading').style.display = 'block';
      
      try {
        const response = await fetch('/api/book-client/' + businessId, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: data.customerName,
            phoneNumber: data.customerPhone,
            serviceId: data.serviceId,
            staffId: data.staffId,
            date: data.date,
            time: data.time,
            notes: data.notes || ''
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          document.getElementById('loading').style.display = 'none';
          document.getElementById('success').style.display = 'block';
        } else {
          throw new Error(result.message || 'Ошибка при создании записи');
        }
      } catch (error) {
        console.error('❌ Booking error:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('errorMessage').textContent = error.message;
      }
    });
  }
});
`;

    res.set({
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.send(jsContent);

  } catch (error) {
    console.error('❌ Get booking script error:', error);
    res.status(500).send('// Error loading script');
  }
};

/**
 * Get services by staff member for booking form
 * GET /api/booking/:businessId/services/:staffId
 */
exports.getServicesByStaff = async (req, res) => {
  try {
    const { businessId, staffId } = req.params;

    // Get business and staff data
    const business = await Business.findById(businessId)
      .populate({
        path: 'services',
        populate: {
          path: 'staff',
          select: '_id'
        }
      })
      .select('services');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Filter services that include this staff member
    const servicesForStaff = business.services.filter(service => 
      service.staff.some(staff => staff._id.toString() === staffId) &&
      service.isActive !== false
    );

    res.json({
      success: true,
      services: servicesForStaff.map(service => ({
        _id: service._id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        description: service.description
      }))
    });
  } catch (error) {
    console.error('Error getting services by staff:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
