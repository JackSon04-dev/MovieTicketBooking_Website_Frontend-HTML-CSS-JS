document.addEventListener("DOMContentLoaded", () => {
  // Handle "Buy Tickets" button clicks
  const ticketButtons = document.querySelectorAll(".btn-ticket");
  ticketButtons.forEach((button) => {
    button.addEventListener("click", () => {
      alert("Đã mua hehehehe");
      // Replace with actual redirect or modal logic
    });
  });

  // Handle "Buy Popcorn" button click
  const popcornButton = document.querySelector(".btn-popcorn");
  popcornButton.addEventListener("click", () => {
    alert("Đã mua bắp nước");
    // Replace with actual redirect or modal logic
  });

  // Handle "See more" button click
  const seeMoreButton = document.querySelector(".btn-see-more");
  seeMoreButton.addEventListener("click", () => {
    alert("Loading more movies...");
    // Replace with actual logic to load more movies
  });

  // Handle "All incentives" button click
  const incentivesButton = document.querySelector(".btn-all-incentives");
  incentivesButton.addEventListener("click", () => {
    alert("Redirecting to all promotions page...");
    // Replace with actual redirect
  });
});
