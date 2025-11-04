// EXTENSION LOAD MARKER - This should appear immediately
console.log("🚀 RYM Extension content script starting to load...");
console.log("Current URL:", window.location.href);
console.log("Document ready state:", document.readyState);
console.log("User agent:", navigator.userAgent);
console.log("Extension context:", typeof chrome !== 'undefined' ? 'Chrome extension' : 'Unknown context');

// Add to window for debugging
window.RYM_EXTENSION_LOADED = true;
window.RYM_EXTENSION_VERSION = "1.0-debug";

function rearrangeHeader() {
  console.log("RYM Redesign extension loaded!");

  // Get all the elements
  const headerContainer = document.querySelector("#page_header");
  const logoElement = document.querySelector(".header_logo");
  const searchBarElement = document.querySelector(".header_search");
  const linksElement = document.querySelector(".header_links");
  const profilePictureElement = document.querySelector(".header_profile");
  const submissionLink = document.querySelector(
    'a.header_icon_link.header_icon_link_artist_profiles.hide-for-small[href="/submissions/"]'
  );
  const headerIconLinkBars = document.querySelector("#header_icon_link_bars");
  
  // Get the listening container element
  const listeningContainer = document.querySelector(".profile_listening_container");
  
  // Log elements for debugging
  console.log("headerContainer:", headerContainer);
  console.log("logoElement:", logoElement);
  console.log("searchBarElement:", searchBarElement);
  console.log("linksElement:", linksElement);
  console.log("profilePictureElement:", profilePictureElement);
  console.log("headerIconLinkBars:", headerIconLinkBars);
  console.log("listeningContainer:", listeningContainer);
  
  if (submissionLink) {
    console.log("Submission link found:", submissionLink);
  } else {
    console.error("Submission link not found!");
  }

  // Check if all required elements exist
  if (
    !headerContainer ||
    !logoElement ||
    !searchBarElement ||
    !linksElement ||
    !profilePictureElement ||
    !headerIconLinkBars ||
    !submissionLink
  ) {
    console.error(
      "Error: One or more header elements not found. Check your selectors in script.js!"
    );
    return;
  }

  // Get the profile image URL from the existing header
  const headerUserImg = document.querySelector('.header_user_img');
  const profileImgUrl = headerUserImg ? headerUserImg.style.backgroundImage : '';
  
  if (!profileImgUrl) {
    console.error("Could not find profile image URL");
    return;
  }

  // Switch the positions of logo_header and logo_name in the logo element
  const logoHeaderElement = logoElement.querySelector('.logo_header');
  const logoNameElement = logoElement.querySelector('.logo_name');
  
  if (logoHeaderElement && logoNameElement) {
    // Store the parent element (likely an <a> tag)
    const parentElement = logoHeaderElement.parentElement;
    
    // Remove both elements from the DOM
    if (logoHeaderElement.parentNode) {
      logoHeaderElement.parentNode.removeChild(logoHeaderElement);
    }
    if (logoNameElement.parentNode) {
      logoNameElement.parentNode.removeChild(logoNameElement);
    }
    
    // Append them back in the reversed order with a space in between
    parentElement.appendChild(logoNameElement);
    
    // Add a small spacer element for additional control (optional)
    
    parentElement.appendChild(logoHeaderElement);
    
    // Ensure the parent has the right display property for alignment
    parentElement.style.display = 'flex';
    parentElement.style.alignItems = 'center';
    
    // Simple vertical alignment for both elements
    logoHeaderElement.style.verticalAlign = 'middle';
    logoNameElement.style.verticalAlign = 'middle';
    
    console.log("Logo elements reordered and aligned successfully!");
  } else {
    console.error("Could not find logo_header or logo_name elements");
  }

  // Save the extended section before clearing the menu container
  const extendedSection = document.getElementById('header_extended_section');
  
  // Replace hamburger with profile picture
  headerIconLinkBars.innerHTML = ''; // Clear existing content
  
  // Create a new profile image element
  const profileImg = document.createElement('div');
  profileImg.className = 'header_menu_profile_img';
  profileImg.style.backgroundImage = profileImgUrl;
  
  // Insert the profile image
  headerIconLinkBars.appendChild(profileImg);
  
  // Re-append the extended section if it exists
  if (extendedSection) {
    headerIconLinkBars.appendChild(extendedSection);
    
    // Add click event to toggle the dropdown menu
    headerIconLinkBars.addEventListener('click', function(e) {
      // Prevent the click from propagating to the document
      e.stopPropagation();
      
      // Toggle the 'active' class on the headerIconLinkBars
      this.classList.toggle('active');
    });
    
    // Close the dropdown when clicking elsewhere on the page
    document.addEventListener('click', function(e) {
      if (!headerIconLinkBars.contains(e.target)) {
        headerIconLinkBars.classList.remove('active');
      }
    });
  }
  
  // Add a span for small screens if needed
  const smallSpan = document.createElement('span');
  smallSpan.className = 'show-for-small';
  headerIconLinkBars.appendChild(smallSpan);

  // Position the element in the center of the header by modifying the layout order
  headerContainer.innerHTML = ""; // Clear the header container before re-appending
  
  // Left group
  headerContainer.appendChild(headerIconLinkBars);
  headerContainer.appendChild(profilePictureElement);
  headerContainer.appendChild(searchBarElement);

  // --- FLEX SPACER FOR CENTERING ---
  var leftSpacer = document.createElement('div');
  leftSpacer.style.flex = '1 1 0%';
  headerContainer.appendChild(leftSpacer);

  // --- DYNAMIC ISLAND INSERTION ---
  if (listeningContainer) {
    listeningContainer.classList.add('dynamic_island');
    headerContainer.appendChild(listeningContainer);
    
    // Variable to store the timeout
    let collapseTimeout;
    
    // Ensure the listening container behaves like a dynamic island
    listeningContainer.addEventListener('mouseenter', function() {
      // Clear any existing timeout when mouse enters
      if (collapseTimeout) {
        clearTimeout(collapseTimeout);
      }
      this.classList.add('expanded');
    });
    
    listeningContainer.addEventListener('mouseleave', function() {
      // Set a timeout to remove the expanded class after 2.5 seconds
      collapseTimeout = setTimeout(() => {
        this.classList.remove('expanded');
      }, 2500); // 2.5 seconds delay
    });
  }

  var rightSpacer = document.createElement('div');
  rightSpacer.style.flex = '1 1 0%';
  headerContainer.appendChild(rightSpacer);
  // --- END DYNAMIC ISLAND INSERTION ---

  // Right group
  headerContainer.appendChild(linksElement);
  headerContainer.appendChild(submissionLink);
  headerContainer.appendChild(logoElement);

  console.log("Header elements reordered successfully!");
}

// Helper function to format text from URL slugs
function formatText(text) {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function redesignListeningComponent() {
  console.log("Redesigning listening component...");
  
  // Get the listening container element
  const listeningContainer = document.querySelector(".profile_listening_container");
  
  if (!listeningContainer) {
    console.error("Listening container not found!");
    return;
  }
  
  console.log("Found listening container:", listeningContainer);
  
  // Get all necessary elements
  const setListeningBox = listeningContainer.querySelector(".profile_set_listening_box");
  const playHistoryContainer = listeningContainer.querySelector("#profile_play_history_container");
  const playHistoryItem = listeningContainer.querySelector(".play_history_item");
  
  if (!setListeningBox || !playHistoryContainer) {
    console.error("Required listening component elements not found!");
    return;
  }
  
  // Find the Play History button (could be outside the current container)
  const playHistoryBtn = document.querySelector('a.btn[href*="play_history"]');
  
  if (!playHistoryBtn) {
    console.error("Play history button not found!");
  } else {
    console.log("Found Play History button:", playHistoryBtn);
    
    // Create play history button container
    const playHistoryBtnContainer = document.createElement("div");
    playHistoryBtnContainer.className = "play_history_btn_container";
    
    // Clone the button to avoid removing it from its original location which might break functionality
    const clonedBtn = playHistoryBtn.cloneNode(true);
    clonedBtn.className = "play_history_btn";
    
    // Extract the number from the button text if it exists (e.g., "Play history (2)")
    const countMatch = playHistoryBtn.textContent.match(/\((\d+)\)/);
    if (countMatch && countMatch[1]) {
      clonedBtn.textContent = `Play history (${countMatch[1]})`;
    } else {
      clonedBtn.textContent = "Play history";
    }
    
    // Copy the href and other attributes
    clonedBtn.href = playHistoryBtn.href;
    
    // Add the cloned button to the container
    playHistoryBtnContainer.appendChild(clonedBtn);
    
    // Check if the container already exists to avoid duplicates
    const existingBtnContainer = listeningContainer.querySelector(".play_history_btn_container");
    if (existingBtnContainer) {
      existingBtnContainer.parentNode.removeChild(existingBtnContainer);
    }
    
    // Append the container to the main listening container
    listeningContainer.appendChild(playHistoryBtnContainer);
  }
  
  // Format the play history item for better display
  if (playHistoryItem) {
    // Find the date and content
    const dateElement = playHistoryItem.querySelector("span.medium");
    const contentElement = playHistoryItem.querySelector("a");
    
    if (dateElement && contentElement) {
      // Store the original content
      const dateText = dateElement.textContent;
      const contentText = contentElement.textContent;
      const contentHref = contentElement.href;
      
      // Try multiple strategies to find album cover
      let albumCoverSrc = "";
      
      // Strategy 1: Direct img in play_history_item
      let albumCoverElement = playHistoryItem.querySelector("img");
      
      // Strategy 2: Look in surrounding elements
      if (!albumCoverElement) {
        albumCoverElement = document.querySelector(".play_history_item img, .play_history_item_container img");
      }
      
      // Strategy 3: Try to find cover art in background images
      if (!albumCoverElement) {
        const backgroundElements = document.querySelectorAll('.play_history_item *[style*="background-image"]');
        for (const element of backgroundElements) {
          const bgImg = element.style.backgroundImage;
          if (bgImg && bgImg.includes('url(')) {
            // Extract URL from background-image
            const urlMatch = bgImg.match(/url\(['"]?(.*?)['"]?\)/);
            if (urlMatch && urlMatch[1]) {
              albumCoverSrc = urlMatch[1];
              break;
            }
          }
        }
      }
      
      // If we found a direct img element
      if (albumCoverElement && !albumCoverSrc) {
        albumCoverSrc = albumCoverElement.src;
      }
      
      // Strategy 4: Extract from URL
      if (!albumCoverSrc) {
        // Try to extract album ID from URL and construct image URL
        const albumIdMatch = contentHref.match(/\/release\/album\/(\d+)/);
        if (albumIdMatch && albumIdMatch[1]) {
          albumCoverSrc = `https://e.snmc.io/i/300/s/${albumIdMatch[1]}/album.jpg`;
        }
      }
      
      // Strategy 5: Default placeholder
      if (!albumCoverSrc) {
        albumCoverSrc = "https://e.snmc.io/3.0/img/album_image_default.png";
      }
      
      // Create album cover image
      const albumCover = document.createElement("img");
      albumCover.src = albumCoverSrc;
      albumCover.alt = contentText;
      
      // Make album cover clickable
      const albumCoverLink = document.createElement("a");
      albumCoverLink.href = contentHref;
      albumCoverLink.appendChild(albumCover);
      
      // Create text container for better styling
      const textContainer = document.createElement("div");
      textContainer.className = "play_history_text";
      
      // Create containers for date and content
      const dateContainer = document.createElement("div");
      dateContainer.className = "play_history_date";
      dateContainer.textContent = dateText;
      
      const contentContainer = document.createElement("div");
      contentContainer.className = "play_history_content";
      
      const contentLink = document.createElement("a");
      contentLink.href = contentHref;
      contentLink.textContent = contentText;
      contentContainer.appendChild(contentLink);
      
      // Add content and date to text container (swapped order)
      textContainer.appendChild(contentContainer);
      textContainer.appendChild(dateContainer);
      
      // Clear the play history item and add the new elements
      playHistoryItem.innerHTML = "";
      playHistoryItem.appendChild(albumCoverLink);
      playHistoryItem.appendChild(textContainer);
    }
  }
  
  console.log("Listening component redesigned successfully!");
}

// Add a function to load the CSS file
function loadStylesheet(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = chrome.runtime.getURL(url);
  (document.head || document.documentElement).appendChild(link);
  console.log(`Stylesheet loaded: ${url}`);
}

// Add a MutationObserver to detect changes to the listening component
function setupListeningObserver() {
  // The target to observe - either the container or a parent element that will contain it
  const targetNode = document.querySelector('body');
  
  if (!targetNode) {
    console.error("Could not find target node for mutation observer");
    return;
  }
  
  // Configuration of the observer
  const config = { 
    childList: true,  // Observe direct children
    subtree: true,    // And lower descendants too
    attributes: true  // Observe attributes changes
  };
  
  // Create an observer instance
  const observer = new MutationObserver(function(mutations) {
    // Check if our listening container exists and needs redesign
    const listeningContainer = document.querySelector(".profile_listening_container");
    
    if (listeningContainer && !listeningContainer.hasAttribute("data-redesigned")) {
      console.log("Listening container detected or modified - applying redesign");
      redesignListeningComponent();
      // Mark as redesigned to avoid redundant processing
      listeningContainer.setAttribute("data-redesigned", "true");
    }
  });
  
  // Start observing
  observer.observe(targetNode, config);
  console.log("Mutation observer set up for listening component");
}

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

// Function to inject music-title class to bubble_header elements
function injectMusicTitleClass() {
  console.log("Injecting music-title class to bubble_header elements...");
  
  const bubbleHeaders = document.querySelectorAll('.bubble_header');
  
  bubbleHeaders.forEach((element, index) => {
    if (!element.classList.contains('music-title')) {
      element.classList.add('music-title');
      console.log(`Added music-title class to bubble_header ${index + 1}:`, element);
    }
  });
  
  console.log(`Processed ${bubbleHeaders.length} bubble_header elements`);
}

// Function to add custom class to specific bubble_header element
function addCustomBubbleHeaderClass() {
  console.log("Adding custom class to specific bubble_header element...");
  
  // Find the specific bubble_header element that contains "music" text
  const bubbleHeaders = document.querySelectorAll('.bubble_header');
  
  bubbleHeaders.forEach((element, index) => {
    if (element.textContent.trim() === 'music') {
      element.classList.add('bubble_header_music-title-name');
      console.log(`Added bubble_header_music-title-name class to element:`, element);
    }
  });
}

// Function to add custom class to film bubble_header element
function addCustomFilmBubbleHeaderClass() {
  console.log("Adding custom class to film bubble_header element...");
  
  // Find the specific bubble_header element that contains "film" text
  const bubbleHeaders = document.querySelectorAll('.bubble_header');
  
  bubbleHeaders.forEach((element, index) => {
    if (element.textContent.trim() === 'film') {
      element.classList.add('bubble_header_film-title-name');
      console.log(`Added bubble_header_film-title-name class to element:`, element);
    }
  });
}

// Function to add compact class to a SPECIFIC bubble_content element
// This targets ONLY the user bio bubble_content on profile pages
function addBubbleContentCompactClass() {
  console.log("Adding bubble-content-compact class to specific bubble_content element...");
  
  // Very specific selector for user bio section on profile pages
  // Look for bubble_content that:
  // 1. Contains rendered_text with user bio
  // 2. Has a div with padding:14px (specific to bio sections)
  // 3. Is within the profile area (profilehii or near profile elements)
  
  const bubbleContentElements = document.querySelectorAll('.bubble_content');
  
  bubbleContentElements.forEach((element) => {
    // Check for the specific structure that indicates user bio
    const hasPaddingDiv = element.querySelector('div[style*="padding:14px"]');
    const hasRenderedText = element.querySelector('.rendered_text');
    
    // Check if it's in a profile context (has profilehii ancestor or is near profile elements)
    const isInProfile = element.closest('.profilehii') || 
                       element.closest('#content')?.querySelector('.profilehii') ||
                       element.closest('table.mbgen');
    
    // Only apply to THIS specific type of bubble_content
    if (hasPaddingDiv && hasRenderedText && isInProfile && !element.classList.contains('bubble-content-compact')) {
      element.classList.add('bubble-content-compact');
      console.log(`✅ Added bubble-content-compact class to user bio bubble_content:`, element);
    }
  });
}

// Function to add unique class to recommendations section
function addRecommendationsSectionClass() {
  console.log("Adding rym-recommendations-section class to recommendations div...");
  
  // Find divs with text-align:center that contain "Recommendations:" text
  const centerDivs = document.querySelectorAll('div[style*="text-align:center"]');
  
  centerDivs.forEach((element) => {
    // Check if this div contains the recommendations links
    const hasRecommendationsText = element.textContent && element.textContent.includes('Recommendations:');
    const hasRecommendationsLink = element.querySelector('a[href*="/recommendations/"]');
    
    // Only apply to the recommendations section
    if (hasRecommendationsText && hasRecommendationsLink && !element.classList.contains('rym-recommendations-section')) {
      element.classList.add('rym-recommendations-section');
      console.log(`✅ Added rym-recommendations-section class to recommendations div:`, element);
    }
  });
}

// Manual function to add class to currently selected element (for console use)
function addCompactClassToSelectedElement() {
  const selection = window.getSelection();
  let element = selection.anchorNode;
  
  // Traverse up to find the bubble_content element
  while (element && !element.classList?.contains('bubble_content')) {
    element = element.parentElement;
  }
  
  if (element && element.classList.contains('bubble_content')) {
    element.classList.add('bubble-content-compact');
    console.log('✅ Added bubble-content-compact class to selected element:', element);
    return element;
  } else {
    console.error('❌ No bubble_content element found in selection');
    return null;
  }
}

// Export function for console use
window.addCompactToSelected = addCompactClassToSelectedElement;

// Observer to handle dynamically added bubble_content and recommendations elements
function setupBubbleContentObserver() {
  try {
    const targetNode = document.body || document.documentElement;
    if (!targetNode) {
      console.error('Bubble content observer: no target node');
      return;
    }
    
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      setTimeout(() => {
        addBubbleContentCompactClass();
        addRecommendationsSectionClass();
        scheduled = false;
      }, 50);
    });
    
    observer.observe(targetNode, { childList: true, subtree: true });
    console.log('Bubble content and recommendations observer set up');
  } catch (e) {
    console.error('Error setting bubble content observer:', e);
  }
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

// Remove empty spacer rows built as a full-width TD (any colspan), e.g. <td style="width:100%" colspan="2|5"></td>
function removeEmptySpacerRows() {
  try {
    let removedCount = 0;

    // Strategy 1: Directly target empty full-width TDs with any colspan
    const emptyFullWidthCells = document.querySelectorAll('td[colspan][style*="width:100%"]');
    emptyFullWidthCells.forEach(td => {
      const isEmpty = td.textContent.trim() === '' && td.children.length === 0;
      if (!isEmpty) return;
      const parentRow = td.closest('tr');
      if (parentRow) {
        parentRow.remove();
        removedCount += 1;
      } else {
        td.remove();
        removedCount += 1;
      }
    });

    // Strategy 2: Fallback for rows that are a single empty TD (any colspan)
    const candidateRows = document.querySelectorAll('tr');
    candidateRows.forEach(tr => {
      const cells = tr.querySelectorAll('td');
      if (cells.length === 1) {
        const td = cells[0];
        const styleAttr = (td.getAttribute('style') || '').toLowerCase();
        const hasFullWidth = styleAttr.includes('width:100%');
        const isEmpty = td.textContent.trim() === '' && td.children.length === 0;
        if (hasFullWidth && isEmpty) {
          tr.remove();
          removedCount += 1;
        }
      } else if (cells.length > 0) {
        // If row has multiple cells but all are empty, remove the row
        const allEmpty = Array.from(cells).every(cell => cell.textContent.trim() === '' && cell.children.length === 0);
        if (allEmpty) {
          tr.remove();
          removedCount += 1;
        }
      }
    });

    // Strategy 3: Remove narrow empty spacer cells (10px wide, vertical-align:top)
    const emptySpacerCells = document.querySelectorAll('td[style*="vertical-align:top"]');
    emptySpacerCells.forEach(td => {
      const isEmpty = td.textContent.trim() === '' && td.children.length === 0 && !td.className;
      const width = td.offsetWidth;
      if (isEmpty && width <= 15) {
        td.remove();
        removedCount += 1;
      }
    });

    if (removedCount > 0) {
      console.log(`Removed ${removedCount} empty spacer row(s).`);
    }
  } catch (e) {
    console.error('Error removing empty spacer rows:', e);
  }
}

// Observe DOM changes and keep removing spacer rows proactively
function setupSpacerRowObserver() {
  try {
    const targetNode = document.body || document.documentElement;
    if (!targetNode) {
      console.error('Spacer row observer: no target node');
      return;
    }
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      setTimeout(() => {
        removeEmptySpacerRows();
        scheduled = false;
      }, 50);
    });
    observer.observe(targetNode, { childList: true, subtree: true });
    console.log('Spacer row observer set up');
  } catch (e) {
    console.error('Error setting spacer row observer:', e);
  }
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

// Enhanced globe initialization function with musicmap support
let lastGlobeInit = 0;
const GLOBE_INIT_THROTTLE = 2000; // 2 seconds

function initMusicGlobe(force = false) {
  const now = Date.now();
  
  // Throttle initialization unless forced
  if (!force && (now - lastGlobeInit) < GLOBE_INIT_THROTTLE) {
    console.log('Globe initialization throttled, skipping...');
    return;
  }
  
  // Check for enhanced globe initialization function
  if (typeof window.initEnhancedRYMGlobe === 'function') {
    console.log('Initializing enhanced music globe with musicmap support...', force ? '(forced)' : '');
    window.initEnhancedRYMGlobe();
    lastGlobeInit = now;
  } else if (typeof window.initRYMMusicGlobes === 'function') {
    console.log('Falling back to standard music globes...', force ? '(forced)' : '');
    window.initRYMMusicGlobes(force);
    lastGlobeInit = now;
  } else {
    console.warn('No globe initialization function found. Make sure enhanced-globe.js or globe.js is loaded.');
  }
}

// Function to add unique class to usermap element for Three.js component
function addUsermapUniqueClass() {
  console.log('Adding unique class to usermap element...');
  
  const usermapElement = document.querySelector('#usermap');
  
  if (usermapElement) {
    // Add unique class for our Three.js component identification
    usermapElement.classList.add('rym-ext-usermap-container');
    usermapElement.classList.add('rym-ext-threejs-target');
    
    // Add data attribute for additional identification
    usermapElement.setAttribute('data-rym-component', 'usermap-threejs');
    usermapElement.setAttribute('data-rym-enhanced', 'true');
    
    console.log('✅ Added unique classes to usermap element:', {
      id: usermapElement.id,
      classes: Array.from(usermapElement.classList),
      dataAttributes: {
        component: usermapElement.getAttribute('data-rym-component'),
        enhanced: usermapElement.getAttribute('data-rym-enhanced')
      }
    });
    
    return usermapElement;
  } else {
    console.log('❌ Usermap element (#usermap) not found');
    return null;
  }
}

// Enhanced musicmap page detection and initialization
function detectMusicmapPage() {
  const url = window.location.href.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  
  // Multiple detection methods with correct URL pattern
  const isMusicmapURL = pathname.includes('/musicmap/') || 
                       pathname.startsWith('/musicmap') ||
                       url.includes('musicmap') ||
                       (pathname.includes('/~') && url.includes('musicmap'));
  
  // Check for actual musicmap container and other indicators
  const hasMusicmapElements = document.querySelector('#usermap') !== null ||
                             document.querySelector('[id*="musicmap"], [class*="musicmap"]') !== null;
  const hasLeafletMap = document.querySelector('.leaflet-container') !== null;
  const hasSVGWithCircles = Array.from(document.querySelectorAll('svg')).some(svg => 
    svg.querySelectorAll('circle').length >= 2
  );
  const isMusicmapTitle = document.title.toLowerCase().includes('music map');
  
  // Additional checks for common musicmap page elements
  const hasMapRelatedElements = document.querySelector('.leaflet-map-pane, .leaflet-overlay-pane, .leaflet-marker-pane') !== null;
  const hasMapScript = Array.from(document.querySelectorAll('script')).some(script => 
    script.textContent && (script.textContent.includes('mapLocations') || script.textContent.includes('L.map'))
  );
  
  const isMusicmapPage = isMusicmapURL || hasMusicmapElements || hasLeafletMap || hasSVGWithCircles || isMusicmapTitle || hasMapRelatedElements || hasMapScript;
  
  // Add unique class to usermap if we detect it's a musicmap page
  if (isMusicmapPage) {
    setTimeout(() => addUsermapUniqueClass(), 100);
  }
  
  console.log('Musicmap page detection:', {
    url: isMusicmapURL,
    elements: hasMusicmapElements,
    leaflet: hasLeafletMap,
    svgCircles: hasSVGWithCircles,
    title: isMusicmapTitle,
    mapElements: hasMapRelatedElements,
    mapScript: hasMapScript,
    usermapExists: !!document.querySelector('#usermap'),
    final: isMusicmapPage
  });
  
  return isMusicmapPage;
}

// Musicmap-specific initialization with enhanced detection
function initMusicmapGlobe() {
  console.log('Initializing musicmap-specific globe...');
  
  // Run musicmap analysis if available
  if (typeof window.analyzeMusicmapPage === 'function') {
    setTimeout(() => {
      console.log('Running musicmap page analysis...');
      window.analyzeMusicmapPage();
    }, 1000);
  }
  
  // Initialize enhanced globe with proper timing
  const initAttempt = (retry = 0) => {
    if (retry > 0) {
      console.log(`Musicmap globe init attempt ${retry + 1}`);
    }
    
    // Check if THREE.js is loaded
    if (typeof THREE === 'undefined') {
      if (retry < 5) {
        setTimeout(() => initAttempt(retry + 1), 500);
        return;
      } else {
        console.error('THREE.js not loaded after multiple attempts');
        return;
      }
    }
    
    // Check if enhanced globe function is available
    if (typeof window.initEnhancedRYMGlobe !== 'function') {
      if (retry < 5) {
        setTimeout(() => initAttempt(retry + 1), 500);
        return;
      } else {
        console.error('Enhanced globe function not available');
        return;
      }
    }
    
    // Initialize the enhanced globe
    try {
      window.initEnhancedRYMGlobe();
      console.log('Musicmap globe initialization completed successfully');
    } catch (error) {
      console.error('Error initializing musicmap globe:', error);
      
      // Fallback to standard globe if available
      if (typeof window.initRYMMusicGlobes === 'function') {
        console.log('Falling back to standard globe initialization');
        window.initRYMMusicGlobes(true);
      }
    }
  };
  
  // Start initialization with appropriate delay
  setTimeout(() => initAttempt(), 1000);
}

// Standard globe initialization for non-musicmap pages
function initStandardPageGlobe() {
  console.log('Initializing globe for standard page...');
  
  const initAttempt = (retry = 0) => {
    if (typeof THREE === 'undefined' || typeof window.initEnhancedRYMGlobe !== 'function') {
      if (retry < 3) {
        setTimeout(() => initAttempt(retry + 1), 500);
        return;
      } else {
        console.warn('Globe dependencies not loaded, skipping globe initialization');
        return;
      }
    }
    
    try {
      window.initEnhancedRYMGlobe();
      console.log('Standard page globe initialization completed');
    } catch (error) {
      console.error('Error initializing standard globe:', error);
    }
  };
  
  setTimeout(() => initAttempt(), 500);
}

// Custom Three.js element initialization function
function initCustomThreeElement() {
  console.log('Starting custom Three.js element initialization...');
  
  // Wait for dependencies
  const initAttempt = (retry = 0) => {
    if (typeof THREE === 'undefined' || typeof window.initRYMCustomThreeElement !== 'function') {
      if (retry < 5) {
        console.log(`Custom Three.js dependencies not ready, retrying... (${retry + 1}/5)`);
        setTimeout(() => initAttempt(retry + 1), 500);
        return;
      } else {
        console.warn('Custom Three.js dependencies not loaded after multiple attempts');
        return;
      }
    }
    
    // Check for conflicts with enhanced globe
    if (typeof window.checkForThreeJSConflicts === 'function') {
      const conflictCheck = window.checkForThreeJSConflicts();
      console.log('Conflict check before custom element init:', conflictCheck);
      
      if (conflictCheck.hasConflicts) {
        console.warn('Potential conflict detected, skipping custom Three.js element initialization:', conflictCheck.conflictType);
        return;
      }
    }
    
    try {
      // Initialize the custom Three.js element
      const customElement = window.initRYMCustomThreeElement('rym-custom-three-display');
      
      if (customElement) {
        console.log('Custom Three.js element initialized successfully');
        
        // Store reference globally for debugging
        window.rymCustomElement = customElement;
        
        // Add to debug functions
        window.destroyCustomElement = () => {
          if (window.rymCustomThreeManager) {
            window.rymCustomThreeManager.destroyAll();
            console.log('All custom Three.js elements destroyed');
          }
        };
        
        window.getCustomElementStatus = () => {
          return {
            managerExists: !!window.rymCustomThreeManager,
            instanceCount: window.rymCustomThreeManager ? window.rymCustomThreeManager.getInstanceCount() : 0,
            instances: window.rymCustomThreeManager ? window.rymCustomThreeManager.getAllInstances().map(i => i.uniqueId) : []
          };
        };
        
      } else {
        console.error('Failed to initialize custom Three.js element');
      }
      
    } catch (error) {
      console.error('Error during custom Three.js element initialization:', error);
    }
  };
  
  // Start initialization with delay to ensure DOM is ready
  setTimeout(() => initAttempt(), 1000);
}

// Enhanced page handling with better detection
function handleMusicmapPage() {
  const isMusicmapPage = detectMusicmapPage();
  
  if (isMusicmapPage) {
    console.log('Detected musicmap page, using enhanced initialization');
    initMusicmapGlobe();
    
    // Set up observer for dynamic content loading on musicmap pages
    setupMusicmapObserver();
    return true;
  } else {
    console.log('Standard page detected, using standard globe initialization');
    initStandardPageGlobe();
    return false;
  }
}

// MutationObserver for musicmap pages to detect when map content loads
function setupMusicmapObserver() {
  console.log('Setting up musicmap content observer...');
  
  let hasTriggered = false;
  
  const observer = new MutationObserver((mutations) => {
    if (hasTriggered) return;
    
    let shouldReinitialize = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if new map-related elements were added
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const hasMapElements = node.querySelectorAll ? 
              node.querySelectorAll('.leaflet-container, .leaflet-map-pane, svg, circle, [class*="marker"]').length > 0 : false;
            
            if (hasMapElements) {
              console.log('New map elements detected:', node);
              shouldReinitialize = true;
            }
          }
        });
      }
    });
    
    if (shouldReinitialize && !hasTriggered) {
      hasTriggered = true;
      console.log('Dynamic map content detected, reinitializing globe...');
      
      // Wait a bit for content to settle, then reinitialize
      setTimeout(() => {
        // Check if globe hasn't been created yet
        if (!window.enhancedGlobeManager?.hasGlobe()) {
          console.log('No globe found, attempting reinitialization...');
          try {
            window.initEnhancedRYMGlobe();
          } catch (error) {
            console.error('Error during globe reinitialization:', error);
          }
        } else {
          console.log('Globe already exists, skipping reinitialization');
        }
      }, 2000);
      
      // Stop observing after first trigger
      observer.disconnect();
    }
  });
  
  // Observe the whole document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
  });
  
  // Stop observing after 15 seconds to prevent endless watching
  setTimeout(() => {
    observer.disconnect();
    console.log('Musicmap observer stopped after timeout');
  }, 15000);
}

// Debug function to analyze current page state
function debugGlobeInitialization() {
  console.log('=== GLOBE INITIALIZATION DEBUG ===');
  console.log('URL:', window.location.href);
  console.log('Pathname:', window.location.pathname);
  console.log('Document ready state:', document.readyState);
  
  // Check dependencies
  console.log('THREE.js loaded:', typeof THREE !== 'undefined');
  console.log('Enhanced globe function available:', typeof window.initEnhancedRYMGlobe === 'function');
  console.log('Musicmap analysis available:', typeof window.analyzeMusicmapPage === 'function');
  console.log('Globe manager available:', !!window.enhancedGlobeManager);
  
  // Check page elements
  const mapElements = {
    'usermap': document.querySelector('#usermap'),              // Primary musicmap container
    'music_map': document.querySelector('#music_map'),         // Secondary map container
    'leaflet_container': document.querySelector('.leaflet-container'),
    'leaflet_map_pane': document.querySelector('.leaflet-map-pane'),
    'leaflet_overlay_pane': document.querySelector('.leaflet-overlay-pane'),
    'svg_elements': document.querySelectorAll('svg'),
    'circles': document.querySelectorAll('circle'),
    'markers': document.querySelectorAll('.leaflet-marker-icon, [class*="marker"]'),
    'musicmap_elements': document.querySelectorAll('[id*="musicmap"], [class*="musicmap"]')
  };
  
  console.log('Page elements found:');
  Object.entries(mapElements).forEach(([key, value]) => {
    if (value && value.length !== undefined) {
      console.log(`  ${key}:`, value.length, 'elements');
    } else {
      console.log(`  ${key}:`, !!value);
    }
  });
  
  // Check if globe already exists
  if (window.enhancedGlobeManager) {
    console.log('Globe manager state:', {
      hasGlobe: window.enhancedGlobeManager.hasGlobe(),
      isInitializing: window.enhancedGlobeManager.isInitializing
    });
  }
  
  // Check for existing globe containers
  const existingGlobes = document.querySelectorAll('.rym-music-globe-container');
  console.log('Existing globe containers:', existingGlobes.length);
  
  console.log('=== END DEBUG ===');
  
  return {
    dependencies: {
      threejs: typeof THREE !== 'undefined',
      enhancedGlobe: typeof window.initEnhancedRYMGlobe === 'function',
      globeManager: !!window.enhancedGlobeManager
    },
    elements: mapElements,
    existingGlobes: existingGlobes.length
  };
}

// Enhanced initialization with comprehensive debugging
function initializeRYMExtension() {
  console.log('=== RYM EXTENSION INITIALIZATION START ===');
  
  // Debug current state
  const debugInfo = debugGlobeInitialization();
  
  // Core UI improvements
  try {
    console.log('Applying header redesign...');
    rearrangeHeader();
    
    console.log('Loading stylesheets...');
    loadStylesheet('styles/listening.css');
    loadStylesheet('styles/profile.css');
    loadStylesheet('styles/musicmap.css');
    
    console.log('Redesigning components...');
    redesignListeningComponent();
    setupListeningObserver();
    repositionPlatformLogos();
    addUniqueProfileIdentifiers();
    restyleProfilePicture();
    injectMusicTitleClass();
    addCustomBubbleHeaderClass();
    addCustomFilmBubbleHeaderClass();
    addBubbleContentCompactClass();
    addRecommendationsSectionClass();
    setupBubbleContentObserver();
    
    // Remove empty spacer rows detected on profile pages
    removeEmptySpacerRows();
    setupSpacerRowObserver();
    
    // Add unique class to usermap element for Three.js targeting
    setTimeout(() => addUsermapUniqueClass(), 500);
    
    // Initialize theme controller
    initializeThemeController();
    
    console.log('Core UI improvements completed successfully');
  } catch (error) {
    console.error('Error during core UI initialization:', error);
  }
  
  // Initialize custom Three.js element
  try {
    console.log('Initializing custom Three.js element...');
    initCustomThreeElement();
  } catch (error) {
    console.error('Error during custom Three.js initialization:', error);
  }
  
  // Enhanced globe initialization with proper page detection
  try {
    console.log('Starting globe initialization...');
    
    // Single initialization path - avoid duplicates
    if (!window.RYM_GLOBE_INIT_STARTED) {
      window.RYM_GLOBE_INIT_STARTED = true;
      
      // Use the smart initialization for musicmap pages
      if (window.location.pathname.includes('/musicmap/')) {
        console.log('🎯 Detected musicmap page, using smart initialization');
        setTimeout(() => {
          if (typeof window.initMusicmapGlobeWithData === 'function') {
            window.initMusicmapGlobeWithData();
          } else {
            console.log('⚠️ Smart init not available, falling back to standard');
            handleMusicmapPage();
          }
        }, 1000);
      } else {
        handleMusicmapPage();
      }
    } else {
      console.log('Globe initialization already started, skipping duplicate');
    }
    
    console.log('Globe initialization sequence started');
  } catch (error) {
    console.error('Error during globe initialization:', error);
  }
  
  // Export debug functions for console use
  window.debugRYMGlobe = debugGlobeInitialization;
  
  // Export removal function for console use
  window.removeUnwantedElements = removeUnwantedButtonCells;
  window.removeEmptySpacerRows = removeEmptySpacerRows;
  window.forceGlobeReinit = () => {
    if (window.enhancedGlobeManager) {
      const container = document.querySelector('.rym-music-globe-container');
      if (container) {
        return window.enhancedGlobeManager.forceReinitialize(container);
      } else {
        console.log('No globe container found, running full reinitialization...');
        return handleMusicmapPage();
      }
    } else {
      console.error('Globe manager not available');
    }
  };
  
  // Export usermap class functions for console use
  window.addUsermapClass = addUsermapUniqueClass;
  window.checkUsermapClass = () => {
    const usermap = document.querySelector('#usermap');
    if (usermap) {
      return {
        element: usermap,
        id: usermap.id,
        classes: Array.from(usermap.classList),
        hasRYMClasses: usermap.classList.contains('rym-ext-usermap-container'),
        dataAttributes: {
          component: usermap.getAttribute('data-rym-component'),
          enhanced: usermap.getAttribute('data-rym-enhanced')
        }
      };
    } else {
      return { error: 'Usermap element not found' };
    }
  };
  window.getGlobeStatus = () => {
    return window.enhancedGlobeManager?.getStatus() || { error: 'Globe manager not available' };
  };
  window.forceMusicmapGlobe = () => {
    console.log('🔄 MANUAL: Forcing musicmap globe creation...');
    return initMusicmapGlobe();
  };
  window.testGlobeDetection = () => {
    return {
      isMusicmapPage: detectMusicmapPage(),
      containers: {
        usermap: !!document.querySelector('#usermap'),
        leafletContainer: !!document.querySelector('.leaflet-container'),
        bubbleContent: !!document.querySelector('.bubble_content'),
        content: !!document.querySelector('#content'),
        existingGlobe: !!document.querySelector('.rym-music-globe-container')
      },
      mapLocationsData: !!window.mapLocations,
      threejsLoaded: typeof THREE !== 'undefined',
      enhancedGlobeLoaded: typeof window.initEnhancedRYMGlobe === 'function'
    };
  };
  
  // Quick fix function for users
  window.fixGlobeCoordinates = () => {
    console.log('🔧 Attempting to fix globe coordinates...');
    
    if (window.location.pathname.includes('/musicmap/')) {
      console.log('🎯 On musicmap page, checking data...');
      
      if (window.mapLocations) {
        console.log('✅ mapLocations found, forcing globe reload...');
        if (typeof window.forceReloadGlobe === 'function') {
          window.forceReloadGlobe();
        } else if (typeof window.initMusicmapGlobeWithData === 'function') {
          window.initMusicmapGlobeWithData();
        } else {
          console.log('⚠️ No reload functions available, trying manual reinit...');
          forceMusicmapGlobe();
        }
      } else {
        console.log('❌ No mapLocations data found yet. Try refreshing the page.');
      }
    } else {
      console.log('❌ Not on a musicmap page');
    }
  };
  
  // Three.js conflict management functions
  window.checkAllThreeJSConflicts = () => {
    console.log('🔍 === THREE.JS CONFLICT CHECK ===');
    if (typeof window.checkForThreeJSConflicts === 'function') {
      const conflicts = window.checkForThreeJSConflicts();
      console.log('Conflict status:', conflicts);
      return conflicts;
    } else {
      console.log('❌ Conflict check function not available');
      return { error: 'Function not loaded' };
    }
  };
  
  window.debugAllThreeJS = () => {
    console.log('🔍 === ALL THREE.JS DEBUG INFO ===');
    console.log('Enhanced Globe Status:', window.getGlobeStatus ? window.getGlobeStatus() : 'Not available');
    console.log('Custom Element Status:', window.getCustomElementStatus ? window.getCustomElementStatus() : 'Not available');
    if (typeof window.debugCustomThreeJS === 'function') {
      window.debugCustomThreeJS();
    }
    if (typeof window.checkAllThreeJSConflicts === 'function') {
      window.checkAllThreeJSConflicts();
    }
  };
  
  console.log('=== RYM EXTENSION INITIALIZATION COMPLETE ===');
}

// Run when DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  console.log("🔥 Running RYM Extension initialization immediately (DOM ready)");
  initializeRYMExtension();
} else {
  console.log("⏰ Waiting for DOMContentLoaded to run RYM Extension");
  document.addEventListener("DOMContentLoaded", initializeRYMExtension);
}

console.log("📜 RYM Extension content script fully loaded!");

// ========================================
// RYM Theme Controller System
// ========================================

// Theme controller for managing RYM extension themes
class RYMThemeController {
  constructor() {
    this.availableThemes = {
      'auto': 'Auto',
      'light': 'OK Computer',
      'night': 'Night', 
      'loveless': 'Loveless',
      'stereolab': 'Stereolab',
      'lasvegas': 'Las Vegas'
    };
    
    // RYM's original theme cycling order (without our custom themes)
    this.originalThemes = ['light', 'loveless', 'night'];
    
    // Extended theme cycling order (includes our custom themes)
    this.extendedThemes = ['auto', 'light', 'loveless', 'night', 'stereolab', 'lasvegas'];
    
    this.currentTheme = this.getCurrentTheme();
    this.init();
  }
  
  init() {
    console.log('🎨 RYM Theme Controller initialized');
    
    // Apply saved theme on load
    this.applyTheme(this.currentTheme);
    
    // Override RYM's original theme cycling if it exists
    this.overrideOriginalThemeCycling();
    
    // Set up theme button if it exists
    this.setupThemeButton();
    
    // Export global functions for console access
    this.exportGlobalFunctions();
  }
  
  getCurrentTheme() {
    // Check localStorage first (our extension's preference)
    let theme = localStorage.getItem('rym_extension_theme');
    
    // If no extension theme, check RYM's original theme
    if (!theme) {
      theme = localStorage.getItem('theme') || 'auto';
    }
    
    // Validate theme exists in our available themes
    if (!this.availableThemes[theme]) {
      theme = 'auto';
    }
    
    return theme;
  }
  
  applyTheme(themeName) {
    const body = document.body || document.querySelector('#page_body');
    if (!body) return;
    
    // Handle auto theme (cycles through original RYM themes based on time or preference)
    if (themeName === 'auto') {
      themeName = this.getAutoTheme();
    }
    
    // Remove all existing theme classes
    Object.keys(this.availableThemes).forEach(theme => {
      if (theme !== 'auto') {
        body.classList.remove(`theme_${theme}`);
      }
    });
    
    // Apply new theme class
    body.classList.add(`theme_${themeName}`);
    
    // Store in both our extension storage and RYM's original storage
    localStorage.setItem('rym_extension_theme', this.currentTheme);
    localStorage.setItem('theme', themeName === 'auto' ? this.getAutoTheme() : themeName);
    
    console.log(`🎨 Applied theme: ${themeName} (original: ${this.currentTheme})`);
    
    // Update theme button display if it exists
    this.updateThemeButtonDisplay();
    
    // Dispatch custom event for other parts of the extension
    window.dispatchEvent(new CustomEvent('rymThemeChanged', { 
      detail: { theme: themeName, originalTheme: this.currentTheme }
    }));
  }
  
  getAutoTheme() {
    // Check if user prefers dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'night';
    }
    
    // Time-based theme selection
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      return 'light';  // Day: 6 AM - 6 PM
    } else if (hour >= 18 && hour < 22) {
      return 'loveless';    // Evening: 6 PM - 10 PM
    } else {
      return 'night';  // Night: 10 PM - 6 AM
    }
  }
  
  cycleTheme() {
    const currentIndex = this.extendedThemes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.extendedThemes.length;
    const nextTheme = this.extendedThemes[nextIndex];
    
    this.switchTheme(nextTheme);
    return nextTheme;
  }
  
  switchTheme(themeName) {
    if (!this.availableThemes[themeName]) {
      console.warn(`Theme "${themeName}" not found. Available themes:`, Object.keys(this.availableThemes));
      return;
    }
    
    this.currentTheme = themeName;
    this.applyTheme(themeName);
    
    console.log(`🎨 Switched to theme: ${themeName}`);
  }
  
  overrideOriginalThemeCycling() {
    // Aggressively override RYM's theme cycling function
    const self = this;
    
    // Define our override function
    const overrideThemeCycle = () => {
      Object.defineProperty(window, 'theme_cycle', {
        value: function() {
          console.log('🔄 Intercepted RYM theme cycle, using extended theme cycling');
          self.cycleTheme();
        },
        writable: true,
        configurable: true
      });
    };
    
    // Override immediately
    overrideThemeCycle();
    
    // Re-override periodically in case RYM redefines it
    setInterval(overrideThemeCycle, 500);
    
    console.log('🔗 Aggressively overrode RYM theme cycling');
    
    // Override theme-related click handlers
    this.setupThemeClickHandlers();
    
    // Setup MutationObserver to catch dynamically added theme buttons
    this.setupThemeButtonObserver();
  }
  
  setupThemeClickHandlers() {
    // Find and override theme buttons with multiple selectors
    const themeButtons = document.querySelectorAll('.header_theme_button, [onclick*="theme"], [onclick*="Theme"], .header_theme_buttons button');
    
    themeButtons.forEach(button => {
      // Mark as processed to avoid duplicate handlers
      if (button.dataset.rymExtensionProcessed) return;
      button.dataset.rymExtensionProcessed = 'true';
      
      // Remove original onclick handlers
      button.removeAttribute('onclick');
      
      // Add our custom handler with capture phase to intercept before RYM's handler
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.cycleTheme();
      }, true); // Capture phase
      
      // Also add in bubble phase for redundancy
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.cycleTheme();
      });
    });
    
    if (themeButtons.length > 0) {
      console.log(`🔗 Setup ${themeButtons.length} theme button handler(s)`);
    }
  }
  
  setupThemeButtonObserver() {
    // Watch for dynamically added theme buttons
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          // Check if any added nodes are theme buttons or contain theme buttons
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              if (node.matches && node.matches('.header_theme_button, [onclick*="theme"]')) {
                this.setupThemeClickHandlers();
              } else if (node.querySelector) {
                const buttons = node.querySelectorAll('.header_theme_button, [onclick*="theme"]');
                if (buttons.length > 0) {
                  this.setupThemeClickHandlers();
                }
              }
            }
          });
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('🔍 Theme button observer activated');
  }
  
  setupThemeButton() {
    // Call multiple times to ensure we catch the theme button
    setTimeout(() => this.setupThemeClickHandlers(), 100);
    setTimeout(() => this.setupThemeClickHandlers(), 500);
    setTimeout(() => this.setupThemeClickHandlers(), 1000);
    setTimeout(() => this.setupThemeClickHandlers(), 2000);
  }
  
  updateThemeButtonDisplay() {
    // Update any theme button text to show current theme
    const themeButtons = document.querySelectorAll('.header_theme_button_mode');
    themeButtons.forEach(button => {
      const displayName = this.availableThemes[this.currentTheme] || this.currentTheme;
      button.textContent = displayName;
    });
  }
  
  // Quick switch methods for console use
  switchToAuto() { this.switchTheme('auto'); }
  switchToLight() { this.switchTheme('light'); }
  switchToNight() { this.switchTheme('night'); }
  switchToLoveless() { this.switchTheme('loveless'); }
  switchToStereolab() { this.switchTheme('stereolab'); }
  switchToLasVegas() { this.switchTheme('lasvegas'); }
  
  exportGlobalFunctions() {
    // Export functions for console access
    window.rymThemeController = this;
    
    window.listThemes = () => {
      console.log('🎨 Available themes:', this.availableThemes);
      return this.availableThemes;
    };
    
    window.switchTheme = (themeName) => {
      this.switchTheme(themeName);
    };
    
    window.getCurrentTheme = () => {
      console.log(`🎨 Current theme: ${this.currentTheme}`);
      return this.currentTheme;
    };
    
    window.cycleTheme = () => {
      return this.cycleTheme();
    };
    
    window.showThemeSelector = () => {
      this.showThemeSelector();
    };
    
    console.log('🌍 Theme controller functions exported to window object');
  }
  
  showThemeSelector() {
    // Create a simple theme selector UI
    const existingSelector = document.getElementById('rym-theme-selector');
    if (existingSelector) {
      existingSelector.remove();
    }
    
    const selector = document.createElement('div');
    selector.id = 'rym-theme-selector';
    selector.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--rym-bg-modal, rgba(0,0,0,0.9));
      border: 1px solid var(--rym-border, rgba(255,255,255,0.1));
      border-radius: 8px;
      padding: 20px;
      z-index: 10000;
      box-shadow: var(--rym-shadow-strong, 0 8px 32px rgba(0,0,0,0.3));
      backdrop-filter: blur(10px);
      color: var(--rym-text-primary, #fff);
      font-family: Arial, sans-serif;
      min-width: 300px;
    `;
    
    const title = document.createElement('h3');
    title.textContent = 'Select Theme';
    title.style.cssText = `
      margin: 0 0 15px 0;
      color: var(--rym-primary, #42A5F5);
      text-align: center;
    `;
    selector.appendChild(title);
    
    // Create theme buttons
    Object.entries(this.availableThemes).forEach(([themeKey, themeName]) => {
      const button = document.createElement('button');
      button.textContent = themeName;
      button.style.cssText = `
        display: block;
        width: 100%;
        margin: 8px 0;
        padding: 12px;
        background: ${themeKey === this.currentTheme ? 'var(--rym-primary, #42A5F5)' : 'transparent'};
        color: var(--rym-text-primary, #fff);
        border: 1px solid var(--rym-border, rgba(255,255,255,0.1));
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
      `;
      
      button.addEventListener('click', () => {
        this.switchTheme(themeKey);
        selector.remove();
      });
      
      button.addEventListener('mouseenter', () => {
        if (themeKey !== this.currentTheme) {
          button.style.background = 'var(--rym-hover-bg, rgba(255,255,255,0.05))';
        }
      });
      
      button.addEventListener('mouseleave', () => {
        if (themeKey !== this.currentTheme) {
          button.style.background = 'transparent';
        }
      });
      
      selector.appendChild(button);
    });
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 15px;
      background: none;
      border: none;
      color: var(--rym-text-muted, rgba(255,255,255,0.6));
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
    `;
    closeButton.addEventListener('click', () => selector.remove());
    selector.appendChild(closeButton);
    
    // Close on outside click
    selector.addEventListener('click', (e) => {
      if (e.target === selector) {
        selector.remove();
      }
    });
    
    document.body.appendChild(selector);
  }
}

// Initialize theme controller when DOM is ready
let rymThemeController;

function initializeThemeController() {
  if (!rymThemeController) {
    rymThemeController = new RYMThemeController();
    console.log('🎨 RYM Theme Controller initialized successfully');
    
    // Verify all themes are properly registered
    console.log('📋 Available themes:', Object.keys(rymThemeController.availableThemes));
    console.log('🔄 Theme cycling order:', rymThemeController.extendedThemes);
    console.log('✨ Current theme:', rymThemeController.currentTheme);
    console.log('💡 Use window.showThemeSelector() to see all themes, or window.cycleTheme() to cycle through them');
  }
}

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initializeThemeController();
} else {
  document.addEventListener('DOMContentLoaded', initializeThemeController);
}

// REMOVED: Simple map replacement moved to main initialization to prevent duplicates
// This section has been consolidated into the main initialization above

