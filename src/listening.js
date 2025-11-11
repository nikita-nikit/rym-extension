// ========================================
// Listening Component Redesign
// ========================================

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
      albumCover.className = "play_history_item_art";
      
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

