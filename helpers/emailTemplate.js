import Mailgen from 'mailgen';

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Jane Smith',
    link: 'https://mailgen.js/'
  }
});

const emailTemplate = (data) => {
  const emailBody = {
    body: {
      name: data.Customer.name,
      intro: ['Find the details of your order below'],
      outro: [
        `${data.Tax.tax_type} : $${(
          (Number(data.Tax.tax_percentage) / 100.0)
          * data.total_amount
        ).toFixed(2)}`,

        `Shipping: ${data.Shipping.shipping_type}`,
        `Total Amount: $${data.total_amount}`
      ],
      table: {
        data: data.OrderDetails.map(item => ({
          product: item.product_name,
          attributes: `${item.attributes
            .split('|')[1]
            .replace('_', ': ')}, ${item.attributes
            .split('|')[0]
            .replace('_', ': ')}`,
          quantity: item.quantity,
          subtotal: `$${item.unit_cost}`
        })),
        columns: {
          customWidth: {
            product: '15%',
            attributes: '20%',
            quantity: '10%',
            subtotal: '10%'
          }
        }
      }
    }
  };
  return mailGenerator.generate(emailBody);
};

export default emailTemplate;
