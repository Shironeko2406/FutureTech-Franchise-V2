export const checkCharacterCount = (editorRef, maxLength, event) => {
    const unprivilegedEditor = editorRef.current.getEditor();
    const plainText = unprivilegedEditor.getText(); // Get plain text without HTML tags
    const textLength = plainText.replace(/\n/g, '').length; // Remove newlines and count characters
  
    if (textLength >= maxLength && event.key !== 'Backspace') {
      event.preventDefault();
    }
  };
  