export const formatAddress = (address) => {
    if (!address) return "Chi nhánh chính";
    const addressParts = address.split(",");
    
    // Lấy tên thành phố (phần cuối cùng)
    const city = addressParts[addressParts.length - 1]?.trim();
    
    // Lấy thông tin quận và phường (từ phần thứ hai đến trước cuối)
    const districtWard = addressParts.slice(1, -1).join(", ").trim();
    
    // Lấy tên đường (phần đầu tiên)
    const street = addressParts[0]?.trim();
    
    return `Chi nhánh ${city} - ${street}, ${districtWard}`;
  };
  