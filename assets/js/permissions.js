// Permission Checker - Auto-Request & Smart Visibility
(() => {
  // ======================
  // Configuration
  // ======================
  const config = {
    autoCheck: true,          // Automatically check permissions on load
    autoRequest: true,        // Automatically request missing permissions
    showFloatingButton: true, // Show the floating toggle button
    hideWhenAllGranted: true, // Hide floating button when all permissions are granted
    position: 'bottom-right', // 'bottom-right' or 'bottom-left'
    animationDuration: 300,   // Animation duration in ms
    delayBetweenRequests: 1000, // Delay between auto permission requests (ms)
    permissions: ['camera', 'location', 'clipboard'] // Permissions to check
  };

  // ======================
  // CSS Styles
  // ======================
  const styles = `
    .pc-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      position: fixed;
      ${config.position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'}
      bottom: 20px;
      z-index: 9999;
      transition: all ${config.animationDuration}ms ease;
    }

    .pc-container.pc-all-granted {
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px);
    }

    .pc-floating-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .pc-floating-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
    }

    .pc-floating-btn:active {
      transform: translateY(0);
    }

    .pc-floating-btn .pc-icon {
      font-size: 22px;
      transition: all 0.3s ease;
    }

    .pc-floating-btn.pc-pulse {
      animation: pc-pulse 2s infinite;
    }

    @keyframes pc-pulse {
      0% { transform: scale(1); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); }
      50% { transform: scale(1.05); box-shadow: 0 4px 25px rgba(0, 0, 0, 0.25); }
      100% { transform: scale(1); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); }
    }

    .pc-status-panel {
      position: absolute;
      ${config.position === 'bottom-right' ? 'right: 0;' : 'left: 0;'}
      bottom: 60px;
      background: white;
      border-radius: 12px;
      padding: 15px;
      width: 280px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: all ${config.animationDuration}ms ease;
    }

    .pc-status-panel.pc-active {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .pc-status-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #f0f0f0;
    }

    .pc-status-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: #333;
    }

    .pc-close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #999;
      font-size: 18px;
    }

    .pc-permission-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      cursor: pointer;
      border-radius: 8px;
      transition: background 0.2s ease;
    }

    .pc-permission-item:hover {
      background: #f9f9f9;
    }

    .pc-permission-icon {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: white;
      font-size: 14px;
    }

    .pc-permission-name {
      flex: 1;
      font-size: 14px;
      color: #444;
    }

    .pc-permission-status {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-left: 10px;
    }

    .pc-permission-status.pc-granted {
      background: #4CAF50;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
    }

    .pc-permission-status.pc-denied {
      background: #F44336;
      box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.2);
    }

    .pc-permission-status.pc-prompt {
      background: #FFC107;
      box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.2);
      animation: pc-status-pulse 1.5s infinite;
    }

    @keyframes pc-status-pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    .pc-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      visibility: hidden;
      transition: all ${config.animationDuration}ms ease;
      backdrop-filter: blur(5px);
    }

    .pc-modal.pc-active {
      opacity: 1;
      visibility: visible;
    }

    .pc-modal-content {
      background: white;
      border-radius: 16px;
      width: 90%;
      max-width: 400px;
      overflow: hidden;
      transform: translateY(20px);
      transition: all ${config.animationDuration}ms ease;
    }

    .pc-modal.pc-active .pc-modal-content {
      transform: translateY(0);
    }

    .pc-modal-header {
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      position: relative;
      text-align: center;
    }

    .pc-modal-icon {
      font-size: 40px;
      margin-bottom: 10px;
    }

    .pc-modal-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    .pc-modal-body {
      padding: 20px;
      text-align: center;
    }

    .pc-modal-message {
      color: #555;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .pc-modal-caption {
      font-size: 13px;
      color: #888;
      font-style: italic;
      margin-top: 20px;
      line-height: 1.4;
    }

    .pc-modal-footer {
      display: flex;
      border-top: 1px solid #f0f0f0;
    }

    .pc-modal-btn {
      flex: 1;
      padding: 15px;
      border: none;
      background: none;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .pc-modal-btn:first-child {
      border-right: 1px solid #f0f0f0;
    }

    .pc-modal-btn.pc-primary {
      color: #667eea;
    }

    .pc-modal-btn.pc-secondary {
      color: #666;
    }

    .pc-modal-btn:hover {
      background: #f9f9f9;
    }
  `;

  // ======================
  // DOM Elements
  // ======================
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  // Main container
  const container = document.createElement('div');
  container.className = 'pc-container';
  document.body.appendChild(container);

  // Floating button
  const floatingBtn = document.createElement('button');
  floatingBtn.className = 'pc-floating-btn';
  floatingBtn.innerHTML = '<span class="pc-icon">🔒</span>';
  container.appendChild(floatingBtn);

  // Status panel
  const statusPanel = document.createElement('div');
  statusPanel.className = 'pc-status-panel';
  statusPanel.innerHTML = `
    <div class="pc-status-header">
      <h3 class="pc-status-title">Permissions</h3>
      <button class="pc-close-btn">&times;</button>
    </div>
    <div class="pc-permission-list"></div>
  `;
  container.appendChild(statusPanel);

  // Modal
  const modal = document.createElement('div');
  modal.className = 'pc-modal';
  modal.innerHTML = `
    <div class="pc-modal-content">
      <div class="pc-modal-header">
        <div class="pc-modal-icon" id="pc-modal-icon">🔒</div>
        <h3 class="pc-modal-title" id="pc-modal-title">Permission Request</h3>
      </div>
      <div class="pc-modal-body">
        <p class="pc-modal-message" id="pc-modal-message">Would you like to grant this permission?</p>
        <p class="pc-modal-caption" id="pc-modal-caption">
          We respect your privacy. This permission will only be used for its intended purpose 
          and will not be used for any unethical activities like blackmail or data harvesting.
        </p>
      </div>
      <div class="pc-modal-footer">
        <button class="pc-modal-btn pc-secondary" id="pc-modal-deny">Deny</button>
        <button class="pc-modal-btn pc-primary" id="pc-modal-allow">Allow</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // ======================
  // State Management
  // ======================
  const state = {
    permissions: {},
    currentPermission: null,
    permissionResolver: null,
    isAutoRequesting: false
  };

  const icons = {
    camera: '📷',
    location: '📍',
    clipboard: '📋',
    default: '🔒'
  };

  const permissionNames = {
    camera: 'Camera',
    location: 'Location',
    clipboard: 'Clipboard'
  };

  const permissionMessages = {
    camera: 'Allow access to your camera for video functionality?',
    location: 'Allow access to your location for location-based features?',
    clipboard: 'Allow access to your clipboard for copy/paste functionality?'
  };

  const permissionCaptions = {
    camera: 'Camera access is needed for video calls or photo capture. We will never access your camera without your explicit permission.',
    location: 'Location data helps provide relevant local information. Your precise location is never stored or shared.',
    clipboard: 'Clipboard access enables easy copy/paste functionality. We will never read your clipboard without your action.'
  };

  // ======================
  // Event Listeners
  // ======================
  floatingBtn.addEventListener('click', toggleStatusPanel);
  document.querySelector('.pc-close-btn').addEventListener('click', toggleStatusPanel);
  document.getElementById('pc-modal-allow').addEventListener('click', () => resolvePermission(true));
  document.getElementById('pc-modal-deny').addEventListener('click', () => resolvePermission(false));

  // ======================
  // Core Functions
  // ======================
  function toggleStatusPanel() {
    statusPanel.classList.toggle('pc-active');
    if (statusPanel.classList.contains('pc-active')) {
      checkAllPermissions();
    }
  }

  function showPermissionModal(type) {
    state.currentPermission = type;
    
    document.getElementById('pc-modal-icon').textContent = icons[type] || icons.default;
    document.getElementById('pc-modal-title').textContent = `${permissionNames[type]} Permission`;
    document.getElementById('pc-modal-message').textContent = permissionMessages[type];
    document.getElementById('pc-modal-caption').textContent = permissionCaptions[type];
    
    modal.classList.add('pc-active');
    
    return new Promise((resolve) => {
      state.permissionResolver = resolve;
    });
  }

  function resolvePermission(granted) {
    if (state.permissionResolver) {
      state.permissionResolver(granted);
      state.permissionResolver = null;
    }
    modal.classList.remove('pc-active');
    state.currentPermission = null;
  }

  function updatePermissionStatus(type, status) {
    state.permissions[type] = status;
    renderPermissionList();
    updateFloatingButtonState();
  }

  function updateFloatingButtonState() {
    // Show pulse animation if any permission needs attention
    const needsAttention = Object.values(state.permissions).some(s => s === 'prompt');
    if (needsAttention) {
      floatingBtn.classList.add('pc-pulse');
    } else {
      floatingBtn.classList.remove('pc-pulse');
    }

    // Hide container if all permissions are granted
    if (config.hideWhenAllGranted) {
      const allGranted = Object.values(state.permissions).every(
        status => status === 'granted' || status === 'denied'
      );
      
      if (allGranted && Object.values(state.permissions).some(s => s === 'granted')) {
        container.classList.add('pc-all-granted');
      } else {
        container.classList.remove('pc-all-granted');
      }
    }
  }

  function renderPermissionList() {
    const listElement = document.querySelector('.pc-permission-list');
    listElement.innerHTML = '';
    
    config.permissions.forEach(permission => {
      const status = state.permissions[permission] || 'unknown';
      
      const item = document.createElement('div');
      item.className = 'pc-permission-item';
      item.innerHTML = `
        <div class="pc-permission-icon" style="background: ${getPermissionColor(permission)}">
          ${icons[permission] || icons.default}
        </div>
        <div class="pc-permission-name">${permissionNames[permission]}</div>
        <div class="pc-permission-status pc-${status}"></div>
      `;
      
      item.addEventListener('click', () => handlePermissionClick(permission));
      listElement.appendChild(item);
    });
  }

  function getPermissionColor(permission) {
    const colors = {
      camera: '#FF7043',
      location: '#42A5F5',
      clipboard: '#66BB6A'
    };
    return colors[permission] || '#9E9E9E';
  }

  async function handlePermissionClick(permission) {
    const currentStatus = state.permissions[permission];
    
    if (currentStatus === 'granted') {
      // Permission already granted
      return;
    }
    
    if (currentStatus === 'denied') {
      // Explain that permission needs to be changed in browser settings
      await showPermissionModal(permission);
      alert(`To change this permission, please update your browser settings for ${permissionNames[permission]}.`);
      return;
    }
    
    // Request permission
    const granted = await showPermissionModal(permission);
    if (granted) {
      try {
        switch(permission) {
          case 'camera':
            await requestCameraPermission();
            break;
          case 'location':
            await requestLocationPermission();
            break;
          case 'clipboard':
            await requestClipboardPermission();
            break;
        }
      } catch (error) {
        console.error(`Error requesting ${permission} permission:`, error);
        updatePermissionStatus(permission, 'denied');
      }
    } else {
      updatePermissionStatus(permission, 'denied');
    }
  }

  // ======================
  // Permission Handlers
  // ======================
  async function checkAllPermissions() {
    for (const permission of config.permissions) {
      try {
        await checkPermission(permission);
      } catch (error) {
        console.error(`Error checking ${permission} permission:`, error);
        updatePermissionStatus(permission, 'prompt');
      }
    }
  }

  async function checkPermission(permission) {
    if (!navigator.permissions || !navigator.permissions.query) {
      updatePermissionStatus(permission, 'prompt');
      return;
    }
    
    let permissionName;
    switch(permission) {
      case 'camera':
        permissionName = 'camera';
        break;
      case 'location':
        permissionName = 'geolocation';
        break;
      case 'clipboard':
        permissionName = 'clipboard-write';
        break;
      default:
        updatePermissionStatus(permission, 'prompt');
        return;
    }
    
    try {
      const status = await navigator.permissions.query({ name: permissionName });
      updatePermissionStatus(permission, status.state);
      
      status.onchange = () => {
        updatePermissionStatus(permission, status.state);
      };
    } catch (error) {
      updatePermissionStatus(permission, 'prompt');
    }
  }

  async function requestCameraPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      updatePermissionStatus('camera', 'granted');
      return true;
    } catch (error) {
      updatePermissionStatus('camera', 'denied');
      return false;
    }
  }

  async function requestLocationPermission() {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => {
          updatePermissionStatus('location', 'granted');
          resolve(true);
        },
        (error) => {
          updatePermissionStatus('location', error.code === error.PERMISSION_DENIED ? 'denied' : 'prompt');
          resolve(false);
        }
      );
    });
  }

  async function requestClipboardPermission() {
    try {
      await navigator.clipboard.writeText('Permission test');
      updatePermissionStatus('clipboard', 'granted');
      return true;
    } catch (error) {
      updatePermissionStatus('clipboard', 'denied');
      return false;
    }
  }

  // ======================
  // Auto-Request Logic
  // ======================
  async function autoRequestPermissions() {
    if (!config.autoRequest || state.isAutoRequesting) return;
    
    state.isAutoRequesting = true;
    
    // Wait for initial permission checks to complete
    await checkAllPermissions();
    
    // Request permissions one by one with delay
    for (const permission of config.permissions) {
      const status = state.permissions[permission];
      
      if (status === 'prompt') {
        const granted = await showPermissionModal(permission);
        
        if (granted) {
          try {
            switch(permission) {
              case 'camera':
                await requestCameraPermission();
                break;
              case 'location':
                await requestLocationPermission();
                break;
              case 'clipboard':
                await requestClipboardPermission();
                break;
            }
          } catch (error) {
            console.error(`Error requesting ${permission} permission:`, error);
            updatePermissionStatus(permission, 'denied');
          }
        } else {
          updatePermissionStatus(permission, 'denied');
        }
        
        // Delay between requests
        await new Promise(resolve => setTimeout(resolve, config.delayBetweenRequests));
      }
    }
    
    state.isAutoRequesting = false;
  }

  // ======================
  // Initialization
  // ======================
  if (config.autoCheck) {
    checkAllPermissions().then(() => {
      if (config.autoRequest) {
        autoRequestPermissions();
      }
    });
  }

  if (!config.showFloatingButton) {
    container.style.display = 'none';
  }

  // Expose public API
  window.PermissionChecker = {
    checkAllPermissions,
    requestCameraPermission,
    requestLocationPermission,
    requestClipboardPermission,
    showStatusPanel: toggleStatusPanel,
    showFloatingButton: (show) => {
      container.style.display = show ? '' : 'none';
    }
  };
})();
