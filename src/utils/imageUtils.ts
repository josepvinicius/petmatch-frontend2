// imageUtils.ts - ATUALIZE PARA MAIOR COMPRESSÃO
export const imageUtils = {
  // Converte arquivo de imagem para Base64 COM MAIS COMPRESSÃO
  async fileToBase64(file: File): Promise<string> {
    // Primeiro, redimensiona antes de converter para Base64
    const compressedBlob = await this.compressImage(file, {
      maxWidth: 600,  // Reduzido de 800
      maxHeight: 400, // Reduzido de 600
      quality: 0.6,   // Mais compressão (60% de qualidade)
      maxSizeMB: 0.5  // Máximo 500KB
    });
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(compressedBlob);
    });
  },

  // Função para comprimir imagem antes da conversão
  async compressImage(file: File, options: {
    maxWidth: number;
    maxHeight: number;
    quality: number;
    maxSizeMB: number;
  }): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Redimensiona mantendo proporção
        if (width > height) {
          if (width > options.maxWidth) {
            height = Math.round((height * options.maxWidth) / width);
            width = options.maxWidth;
          }
        } else {
          if (height > options.maxHeight) {
            width = Math.round((width * options.maxHeight) / height);
            height = options.maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Converte para Blob com qualidade reduzida
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Falha ao comprimir imagem'));
              return;
            }
            
            // Verifica se está dentro do limite
            if (blob.size > options.maxSizeMB * 1024 * 1024) {
              // Se ainda estiver grande, tenta mais compressão
              this.compressImage(file, {
                ...options,
                quality: options.quality * 0.8,
                maxWidth: options.maxWidth * 0.8,
                maxHeight: options.maxHeight * 0.8
              }).then(resolve).catch(reject);
            } else {
              resolve(blob);
            }
          },
          'image/jpeg',
          options.quality
        );
      };
      
      img.onerror = reject;
      img.src = url;
    });
  },

  // Versão simplificada para MVP (mais rápida)
  async fileToBase64Simple(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result as string;
        
        // Se for maior que 500KB, redimensiona
        if (base64String.length > 0.5 * 1024 * 1024) {
          try {
            const resized = await this.resizeImage(base64String, 400, 300, 0.5);
            resolve(resized);
          } catch {
            resolve(base64String); // Fallback
          }
        } else {
          resolve(base64String);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Redimensiona imagem Base64 (atualizada)
  resizeImage(base64String: string, maxWidth: number, maxHeight: number, quality = 0.5): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64String;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Redimensiona para no máximo 400x300
        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compressão mais agressiva (50% de qualidade)
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      
      img.onerror = () => resolve(base64String);
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