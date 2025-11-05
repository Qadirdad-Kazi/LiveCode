// PHP execution utility
// Note: PHP execution requires a backend server with PHP installed

export async function executePHP(code) {
  try {
    const response = await fetch('http://localhost:4000/execute/php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to execute PHP code');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('PHP execution error:', error);
    throw error;
  }
}

