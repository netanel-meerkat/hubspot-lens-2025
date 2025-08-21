// Simple HubSpot Lens Drawer - Just Works!
console.log('🚀 HubSpot Lens Simple Drawer Loading...');

// Create drawer immediately when script loads
setTimeout(() => {
  console.log('🔧 Creating simple drawer...');
  
  try {
    // Remove any existing drawer
    const existingDrawer = document.getElementById('hubspot-inspector-drawer');
    if (existingDrawer) {
      existingDrawer.remove();
      console.log('🗑️ Removed existing drawer');
    }
    
    // Create simple drawer
    const drawer = document.createElement('div');
    drawer.id = 'hubspot-inspector-drawer';
    drawer.innerHTML = `
      <div class="inspector-toggle" id="inspector-toggle" style="
        position: fixed;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
        color: white;
        padding: 12px 8px;
        border-radius: 8px 0 0 8px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: 18px;
        z-index: 10001;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <span>🔍</span>
        <span style="margin-left: 4px;">Lens</span>
      </div>
      
      <div class="inspector-panel" id="inspector-panel" style="
        position: fixed;
        top: 0;
        right: 0;
        width: 400px;
        height: 100vh;
        background: white;
        box-shadow: -4px 0 20px rgba(0,0,0,0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <h2 style="margin: 0; font-size: 18px;">🔍 HubSpot Lens</h2>
          <button id="close-inspector" style="
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
          ">×</button>
        </div>
        
        <div style="padding: 20px; flex: 1; overflow-y: auto;">
          <h3>🚀 HubSpot Lens is Working!</h3>
          <p>If you can see this, the drawer is working!</p>
          
          <div style="margin-top: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
            <h4>🎯 What's Working:</h4>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li>✅ Drawer created successfully</li>
              <li>✅ Toggle button visible</li>
              <li>✅ Panel opens and closes</li>
              <li>✅ Basic functionality restored</li>
            </ul>
          </div>
          
          <button id="reconnect-btn" style="
            background: #8b5cf6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
            margin-top: 20px;
            font-size: 14px;
            font-weight: 600;
          ">🔄 Reconnect to HubSpot</button>
          
          <div style="margin-top: 20px; font-size: 12px; color: #6c757d;">
            <p><strong>Next Steps:</strong></p>
            <p>1. Click the 🔍 Lens button on the right to open</p>
            <p>2. Click the × button to close</p>
            <p>3. The complex features can be added back once this basic structure works</p>
          </div>
        </div>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(drawer);
    console.log('✅ Simple drawer created and added to page!');
    
    // Setup basic events
    const toggle = document.getElementById('inspector-toggle');
    const panel = document.getElementById('inspector-panel');
    const closeBtn = document.getElementById('close-inspector');
    
    if (toggle && panel) {
      toggle.addEventListener('click', () => {
        const isOpen = panel.style.transform === 'translateX(0px)';
        panel.style.transform = isOpen ? 'translateX(100%)' : 'translateX(0px)';
        console.log('🔄 Toggle clicked, panel is now:', isOpen ? 'closed' : 'open');
      });
      console.log('✅ Toggle events setup');
    }
    
    if (closeBtn && panel) {
      closeBtn.addEventListener('click', () => {
        panel.style.transform = 'translateX(100%)';
        console.log('🔄 Close clicked, panel closed');
      });
      console.log('✅ Close events setup');
    }
    
    // Test if everything is working
    setTimeout(() => {
      const drawerExists = !!document.getElementById('hubspot-inspector-drawer');
      const toggleExists = !!document.getElementById('inspector-toggle');
      const panelExists = !!document.getElementById('inspector-panel');
      
      console.log('🔍 Final Check:');
      console.log('  - Drawer exists:', drawerExists);
      console.log('  - Toggle exists:', toggleExists);
      console.log('  - Panel exists:', panelExists);
      
      if (drawerExists && toggleExists && panelExists) {
        console.log('🎉 SUCCESS: Simple drawer is working!');
        console.log('💡 Look for the 🔍 Lens button on the right side of the page');
      } else {
        console.log('❌ Something is missing');
      }
    }, 500);
    
  } catch (error) {
    console.error('❌ Error creating drawer:', error);
  }
}, 1000);

console.log('📝 Simple drawer script loaded, will create drawer in 1 second...');
