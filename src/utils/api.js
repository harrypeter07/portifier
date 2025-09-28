const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class APIClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };
    
    if (config.body && typeof config.body !== 'string' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }
    
    if (config.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }
  
  // File operations
  uploadFile(file, fileType = 'pdf') {
    const formData = new FormData();
    formData.append('file', file);
    
    let endpoint = '/api/pdf/upload';
    if (fileType === 'python') endpoint = '/api/file/python/view';
    else if (fileType === 'jupyter') endpoint = '/api/file/jupyter/view';
    else if (fileType === 'word') endpoint = '/api/file/convert/word-to-pdf';
    else if (fileType === 'image') endpoint = '/api/file/upload';
    
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
    });
  }
  
  // PDF operations
  getPdfInfo() {
    return this.request('/api/pdf/info');
  }
  
  getPage(pageNum, zoom = 1.0) {
    return this.request(`/api/pdf/page/${pageNum}?zoom=${zoom}`);
  }
  
  updateText(elementId, newText, fontSize, color) {
    return this.request('/api/pdf/update-text', {
      method: 'POST',
      body: {
        element_id: elementId,
        new_text: newText,
        new_font_size: fontSize,
        new_color: color,
      },
    });
  }
  
  extractImageText() {
    return this.request('/api/pdf/ocr');
  }
  
  searchReplace(searchTerm, replaceWith) {
    return this.request('/api/pdf/search-replace', {
      method: 'POST',
      body: {
        search_term: searchTerm,
        replace_with: replaceWith,
      },
    });
  }
  
  downloadPDF() {
    return this.request('/api/pdf/save');
  }
  
  // Code execution (placeholder - would need to be implemented in backend)
  executePythonCode(code) {
    // For now, return a mock response
    return Promise.resolve({
      output: `Executed: ${code}\nOutput: Hello from Python!`,
      success: true
    });
  }
  
  executeJupyterCell(code, cellType = 'code') {
    // For now, return a mock response
    return Promise.resolve({
      output: `Executed cell: ${code}\nOutput: Hello from Jupyter!`,
      success: true
    });
  }
  
  // Resume management
  saveResume(resumeData) {
    const formData = new FormData();
    
    // Add file if present
    if (resumeData.file) {
      formData.append('file', resumeData.file);
    }
    
    // Add resume data as JSON
    const { file, ...dataWithoutFile } = resumeData;
    formData.append('resumeData', JSON.stringify(dataWithoutFile));
    
    return this.request('/api/resume/save', {
      method: 'POST',
      body: formData,
    });
  }
  
  getResume(resumeId) {
    return this.request(`/api/resume/${resumeId}`);
  }
  
  listResumes() {
    return this.request('/api/resume/list');
  }
  
  deleteResume(resumeId) {
    return this.request(`/api/resume/${resumeId}`, {
      method: 'DELETE',
    });
  }
  
  // PDF Analysis
  analyzeResume(pdfFile) {
    const formData = new FormData();
    formData.append('file', pdfFile);
    
    return this.request('/api/resume/analyze', {
      method: 'POST',
      body: formData,
    });
  }
  
  generateResumeSuggestions(resumeData) {
    return this.request('/api/resume/suggestions', {
      method: 'POST',
      body: resumeData,
    });
  }
}

export default new APIClient();
