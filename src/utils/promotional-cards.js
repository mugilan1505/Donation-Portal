// This file contains SVG templates for promotional cards

export const PromotionalCards = {
  facebookCard: `
    <svg xmlns="http://www.w3.org/2000/svg" width="260" height="150" viewBox="0 0 260 150">
      <rect width="260" height="150" fill="#f0f0f0"/>
      <rect x="15" y="15" width="230" height="40" fill="#982e4b"/>
      <text x="25" y="42" font-family="Arial" font-size="16" fill="white">Support our fundraiser</text>
      
      <rect x="15" y="65" width="60" height="60" fill="#ffffff" stroke="#982e4b" stroke-width="2"/>
      <circle cx="45" cy="95" r="20" fill="#982e4b"/>
      
      <rect x="85" y="65" width="160" height="15" fill="#333333"/>
      <rect x="85" y="87" width="130" height="10" fill="#666666"/>
      <rect x="85" y="105" width="110" height="10" fill="#666666"/>
      
      <rect x="85" y="125" width="70" height="15" rx="7.5" fill="#982e4b"/>
      <text x="95" y="137" font-family="Arial" font-size="9" fill="white">Donate Now</text>
    </svg>
  `,
  
  printableCard: `
    <svg xmlns="http://www.w3.org/2000/svg" width="260" height="150" viewBox="0 0 260 150">
      <rect width="260" height="150" fill="#ffffff" stroke="#ccc" stroke-width="1"/>
      
      <rect x="15" y="15" width="230" height="40" fill="#982e4b"/>
      <text x="25" y="42" font-family="Arial" font-size="16" fill="white">Help us reach our goal</text>
      
      <rect x="15" y="65" width="150" height="70" fill="#f0f0f0"/>
      <text x="25" y="90" font-family="Arial" font-size="10" fill="#333">Story: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.</text>
      <text x="25" y="110" font-family="Arial" font-size="10" fill="#333">Goal: ₹200,000</text>
      <text x="25" y="125" font-family="Arial" font-size="10" fill="#333">Scan to donate:</text>
      
      <rect x="175" y="65" width="70" height="70" fill="#f0f0f0" stroke="#ccc" stroke-width="1"/>
      
      <!-- Simplified QR code representation -->
      <rect x="185" y="75" width="50" height="50" fill="#ffffff" stroke="#000000" stroke-width="1"/>
      <rect x="195" y="85" width="30" height="30" fill="#000000"/>
      <rect x="200" y="90" width="20" height="20" fill="#ffffff"/>
    </svg>
  `
};

export default PromotionalCards; 