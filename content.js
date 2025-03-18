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
  
  // Log elements for debugging
  console.log("headerContainer:", headerContainer);
  console.log("logoElement:", logoElement);
  console.log("searchBarElement:", searchBarElement);
  console.log("linksElement:", linksElement);
  console.log("profilePictureElement:", profilePictureElement);
  console.log("headerIconLinkBars:", headerIconLinkBars);
  
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

  // Reorder header elements (if you still want to do this)
  headerContainer.innerHTML = ""; // Clear the header container before re-appending
  
  
  headerContainer.appendChild(headerIconLinkBars);
  headerContainer.appendChild(profilePictureElement);
  headerContainer.appendChild(searchBarElement);
  headerContainer.appendChild(linksElement);
  headerContainer.appendChild(submissionLink);
  headerContainer.appendChild(logoElement);  

  console.log("Header elements reordered successfully!");
}

// Run immediately if the document is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  rearrangeHeader();
} else {
  // Otherwise, run when the DOM is fully loaded
  document.addEventListener("DOMContentLoaded", rearrangeHeader);
}

