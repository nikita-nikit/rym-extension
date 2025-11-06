// ========================================
// Profile Page Enhancements
// ========================================

// Function to move platform logos to the left of the username
function repositionPlatformLogos() {
  console.log("Repositioning platform logos...");
  
  // Find the profile name span
  const profileNameSpan = document.querySelector('#profilename');
  
  if (!profileNameSpan) {
    console.log("Profile name span not found");
    return;
  }
  
  // Get the parent container of the profile name
  const profileHeader = profileNameSpan.closest('.bubble_header.profile_header');
  
  if (!profileHeader) {
    console.log("Profile header not found");
    return;
  }
  
  // Find all platform logo links (Sonemic, Glitchwave, etc.)
  const platformLinks = [];
  
  // Find Sonemic logo
  const sonemicLink = document.querySelector('a[href*="~"][title*="View music profile"][href*="sonemic"]') ||
                      document.querySelector('a[href*="~"]:has(img[src*="sonemic"])') ||
                      document.querySelector('a[title*="View music profile"]:has(img[src*="sonemic"])');
  
  // Find Glitchwave logo
  const glitchwaveLink = document.querySelector('a:has(img[src*="glitchwave"])') ||
                         document.querySelector('img[src*="glitchwave"]')?.closest('a');
  
  // Find any other platform logos
  const otherPlatformLinks = document.querySelectorAll('a:has(img[src*="-64.png"]), a:has(img[style*="1.7em"])');
  
  if (sonemicLink) platformLinks.push(sonemicLink);
  if (glitchwaveLink) platformLinks.push(glitchwaveLink);
  
  // Add other platform links if they're not already included
  otherPlatformLinks.forEach(link => {
    if (!platformLinks.includes(link)) {
      platformLinks.push(link);
    }
  });
  
  if (platformLinks.length === 0) {
    console.log("No platform logos found");
    return;
  }
  
  // Check if we already have a username container
  let usernameContainer = profileNameSpan.parentNode;
  if (usernameContainer.tagName !== 'DIV' || !usernameContainer.style.display) {
    // Create a container for the username and logos
    usernameContainer = document.createElement('div');
    usernameContainer.style.display = 'flex';
    usernameContainer.style.alignItems = 'center';
    usernameContainer.style.justifyContent = 'flex-end';
    usernameContainer.style.marginBottom = '0px';
    usernameContainer.style.gap = '0px';
    usernameContainer.style.paddingRight = '5px';
    
    // Remove the profile name from its current location
    const originalParent = profileNameSpan.parentNode;
    originalParent.removeChild(profileNameSpan);
    
    // Add the username to the new container
    usernameContainer.appendChild(profileNameSpan);
    
    // Insert the container where the profile name was
    originalParent.appendChild(usernameContainer);
  }
  
  // Clone and add each platform logo to the left of the username
  platformLinks.forEach(link => {
    if (!link) return;
    
    // Clone the link to avoid breaking any existing functionality
    const clonedLink = link.cloneNode(true);
    
    // Add some styling to position it properly
    clonedLink.style.marginRight = '6px';
    clonedLink.style.display = 'inline-block';
    clonedLink.style.verticalAlign = 'middle';
    clonedLink.style.order = '-1'; // Place before username
    
    // Ensure the image inside has proper styling
    const img = clonedLink.querySelector('img');
    if (img) {
      img.style.width = '1.7em';
      img.style.height = '1.7em';
      img.style.marginLeft = '0';
      img.style.marginRight = '0';
    }
    
    // Insert the logo before the username
    usernameContainer.insertBefore(clonedLink, profileNameSpan);
    
    // Hide the original link if it's still visible
    if (link.parentNode) {
      link.style.display = 'none';
    }
  });
  
  console.log(`${platformLinks.length} platform logo(s) repositioned successfully!`);
}

// Function to add unique identifiers to profile elements for CSS styling
function addUniqueProfileIdentifiers() {
  console.log("Adding unique identifiers to profile elements...");
  
  // Find all elements with class "profilehii"
  const profileElements = document.querySelectorAll('.profilehii');
  
  profileElements.forEach((element, index) => {
    // Add unique identifier to the main profile div
    const uniqueId = `rym-ext-profile-${index + 1}`;
    element.classList.add('rym-ext-profile-container');
    element.setAttribute('data-rym-profile-id', uniqueId);
    element.id = uniqueId;
    
    // Add unique classes to child elements for granular styling
    const table = element.querySelector('table.mbgen');
    if (table) {
      table.classList.add('rym-ext-profile-table');
      
      // Add classes to table rows for specific styling
      const rows = table.querySelectorAll('tr');
      rows.forEach((row, rowIndex) => {
        switch(rowIndex) {
          case 0: // Username row
            row.classList.add('rym-ext-profile-username-row');
            break;
          case 1: // Age/Gender row
            row.classList.add('rym-ext-profile-demographics-row');
            break;
          case 2: // Location row
            row.classList.add('rym-ext-profile-location-row');
            break;
          case 3: // Links row
            row.classList.add('rym-ext-profile-links-row');
            break;
          default:
            row.classList.add(`rym-ext-profile-row-${rowIndex}`);
        }
        
        // Add classes to cells within each row
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, cellIndex) => {
          cell.classList.add(`rym-ext-profile-cell-${cellIndex}`);
        });
      });
    }
    
    // Add classes to any links within the profile
    const links = element.querySelectorAll('a');
    links.forEach((link, linkIndex) => {
      link.classList.add('rym-ext-profile-link');
      link.classList.add(`rym-ext-profile-link-${linkIndex}`);
    });
    
    // Add class to rendered text spans
    const renderedTexts = element.querySelectorAll('.rendered_text');
    renderedTexts.forEach((span, spanIndex) => {
      span.classList.add('rym-ext-rendered-text');
      span.classList.add(`rym-ext-rendered-text-${spanIndex}`);
    });
    
    console.log(`Profile element ${index + 1} enhanced with unique identifiers:`, element);
  });
  
  // Find and enhance button rows (social action buttons)
  const buttonRows = document.querySelectorAll('tr:has(td#follow_user), tr:has(td[id*="block"]), tr:has(.btn.tool_btn)');
  buttonRows.forEach((row, index) => {
    row.classList.add('rym-ext-button-row');
    row.classList.add(`rym-ext-button-row-${index + 1}`);
    
    // Add classes to button cells
    const buttonCells = row.querySelectorAll('td');
    buttonCells.forEach((cell, cellIndex) => {
      cell.classList.add('rym-ext-button-cell');
      cell.classList.add(`rym-ext-button-cell-${cellIndex + 1}`);
      
      // Add classes to buttons within cells
      const buttons = cell.querySelectorAll('.btn, .tool_btn, a[title]');
      buttons.forEach((button, buttonIndex) => {
        button.classList.add('rym-ext-action-button');
        
        // Add specific classes based on button type
        if (cell.id === 'follow_user' || button.textContent.trim() === '+') {
          button.classList.add('rym-ext-follow-button');
        } else if (cell.id && cell.id.includes('block')) {
          button.classList.add('rym-ext-block-button');
        } else if (button.textContent.trim() === 'c') {
          button.classList.add('rym-ext-comment-button');
        } else if (button.textContent.trim() === 'pm') {
          button.classList.add('rym-ext-message-button');
        } else if (button.textContent.trim() === '♪') {
          button.classList.add('rym-ext-music-button');
        }
      });
    });
    
    console.log(`Button row ${index + 1} enhanced with unique identifiers:`, row);
  });
  
  console.log(`${profileElements.length} profile element(s) enhanced with unique identifiers!`);
  
  // Remove specific button cell elements
  removeUnwantedButtonCells();
}

// Function to remove unwanted button cell elements
function removeUnwantedButtonCells() {
  console.log("Removing unwanted button cell elements...");
  
  // Target the specific cell class that was selected
  const unwantedCells = document.querySelectorAll('.rym-ext-button-cell-14');
  
  unwantedCells.forEach((cell, index) => {
    const parentRow = cell.closest('tr');
    if (parentRow) {
      console.log(`Removing button row ${index + 1} containing rym-ext-button-cell-14:`, parentRow);
      parentRow.remove();
    } else {
      console.log(`Removing button cell ${index + 1}:`, cell);
      cell.remove();
    }
  });
  
  // Also remove any empty table rows that might be left behind
  const emptyRows = document.querySelectorAll('tr:empty, tr:has(td:empty):not(:has(td:not(:empty)))');
  emptyRows.forEach((row, index) => {
    console.log(`Removing empty row ${index + 1}:`, row);
    row.remove();
  });
  
  console.log(`Removed ${unwantedCells.length} unwanted button cell elements`);
}

function restyleProfilePicture() {
  const profileImage = document.getElementById('profile_image');
  if (profileImage) {
    profileImage.classList.add('rym-ext-profile-picture');
  }
  // Optionally inject the style if not in your CSS file:
  if (!document.getElementById('rym-ext-profile-picture-style')) {
    const style = document.createElement('style');
    style.id = 'rym-ext-profile-picture-style';
    style.textContent = `
.rym-ext-profile-picture {
  box-shadow: 0 4px 24px rgba(66, 165, 245, 0.18), 0 1.5px 8px rgba(0,0,0,0.10) !important;
  border: 2px solid #fff !important;
  background-size: cover !important;
  background-position: center !important;
  width: 340px !important;
  height: 260px !important;
  min-width: 220px !important;
  min-height: 180px !important;
  max-width: 400px !important;
  max-height: 320px !important;
  margin: 0 auto 12px auto !important;
  position: relative !important;
  padding: 0 !important;
  cursor: pointer !important;
  transition: box-shadow 0.2s, border-color 0.2s !important;
}
.rym-ext-profile-picture:hover {
  box-shadow: 0 8px 32px rgba(66, 165, 245, 0.28), 0 2px 12px rgba(0,0,0,0.15) !important;
  border-color: #fff !important;
}
.rym-ext-profile-picture .profile_caption {
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 100% !important;
  background: rgba(28,32,44,0.82) !important;
  color: #e3f2fd !important;
  font-size: 1em !important;
  text-align: center !important;
  padding: 6px 12px !important;
  border-top: 1px solid rgba(66, 165, 245, 0.10) !important;
  border-radius: 0 0 0 0 !important;
}
`;
    document.head.appendChild(style);
  }
}

