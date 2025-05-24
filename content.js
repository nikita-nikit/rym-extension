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
      
      // Add date and content to text container
      textContainer.appendChild(dateContainer);
      textContainer.appendChild(contentContainer);
      
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

// Run immediately if the document is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  rearrangeHeader();
  loadStylesheet('styles/listening.css');
  redesignListeningComponent();
  setupListeningObserver();
} else {
  // Otherwise, run when the DOM is fully loaded
  document.addEventListener("DOMContentLoaded", function() {
    rearrangeHeader();
    loadStylesheet('styles/listening.css');
    redesignListeningComponent();
    setupListeningObserver();
  });
}

