document.addEventListener('DOMContentLoaded', async () => {
    const {session_id} = await fetch('/session').then((r) => r.json());
    console.log(session_id);

    const { Hellgate } = window;
    const client = await Hellgate.init(session_id, { base_url: 'https://staging.hellgate.dev', challenge_3ds_container: document.getElementById("challenge") });
    const cardHandler = await client.use('CARD');

    const cardForm = cardHandler.createForm();
    cardForm.mount('#card-form');

    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', async () => {
        try {
          additionalData = {
            cardholder_name: document.getElementById("cardholder-name").value,
          };

          const result = await cardHandler.process(additionalData);

          if (result.status === 'success') {
            console.log('Processing is successfully finished');
            alert(result.data.token_id);
          } else {
            console.log("Processing failed");
          }
        } catch (e) {
          console.log(e.message);
        }
      });
}); 