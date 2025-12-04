export const imageUtils = {
  // Converte arquivo de imagem para Base64
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64String = reader.result as string;
        // Redimensiona a imagem para não ficar muito grande
        if (base64String.length > 2 * 1024 * 1024) { // 2MB
          this.resizeImage(base64String, 800, 600).then(resolve).catch(reject);
        } else {
          resolve(base64String);
        }
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Redimensiona imagem Base64
  resizeImage(base64String: string, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64String;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calcula novo tamanho mantendo proporção
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compressão JPEG 70%
      };
      
      img.onerror = () => resolve(base64String); // Se der erro, retorna original
    });
  },

  // Gera URL de placeholder se não tiver foto
  getPlaceholderImage(especie: string): string {
    const placeholders: Record<string, string> = {
      'cachorro': 'https://placehold.co/300x200/4A90E2/FFFFFF?text=Cachorro',
      'gato': 'https://placehold.co/300x200/50E3C2/FFFFFF?text=Gato',
      'pássaro': 'https://placehold.co/300x200/F5A623/FFFFFF?text=Pássaro',
      'coelho': 'https://placehold.co/300x200/9013FE/FFFFFF?text=Coelho',
      'outros': 'https://placehold.co/300x200/B8E986/FFFFFF?text=Pet'
    };
    
    const key = Object.keys(placeholders).find(key => 
      especie.toLowerCase().includes(key)
    ) || 'outros';
    
    return placeholders[key];
  }
};