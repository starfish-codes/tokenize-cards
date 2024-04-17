document.addEventListener('DOMContentLoaded', async () => {
    const {session_id} = await fetch('/session').then((r) => r.json());
    console.log(session_id);

    const { Hellgate } = window;
    const client = await Hellgate.init(session_id, { base_url: 'https://sandbox.hellgate.io' });
    const cardHandler = await client.use('CARD');

    const cardForm = cardHandler.createForm();
    cardForm.mount('#card-form');

    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', async () => {
        const result = await cardHandler.process();
      
        // handle the result
        if (result.status === 'success') {
          console.log('Processing is successfully finished');
          console.log(result);
        } else {
          console.log("Processing failed");
        }
      });
}); 