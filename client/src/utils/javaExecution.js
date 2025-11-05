// Java execution utility
// Note: Java execution requires a backend server with Java compiler

export async function executeJava(code) {
  try {
    const response = await fetch('http://localhost:4000/execute/java', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to execute Java code');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Java execution error:', error);
    throw error;
  }
}

export async function compileJava(code) {
  try {
    const response = await fetch('http://localhost:4000/compile/java', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to compile Java code');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Java compilation error:', error);
    throw error;
  }
}

