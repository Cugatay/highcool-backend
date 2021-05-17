const nodemailer = require('nodemailer');

const emailSender = async ({ email, code }) => {
  console.log('Göndereyrum');
  const sender = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_PASSWORD,
    to: email,
    subject: 'E-posta Doğrulama Kodu',
    html: `
      <h1>Görkemli Prisold Dünyasına Hoş Geldin</h1>
      <h2>Bu Gizemli Dünyanın Kapılarını Aralamak İçin İhtiyacın Olan Tek Şey Bir Kod</h2>
      <h2>Unutma, Bu Kapıdan Giren Hiç Kimse Dünyaya Bir Daha Aynı Gözle Bakamadı. Kendilerine Solder Diyen Bu Grup, Gerçekleri Sorgulamak Adına Verdikleri Büyük Mücadeleler İle Ortadünya'ya Barışı ve Adaleti Sağladılar</h2>
      <h2>Eğer Sen de bu Kutsal İttifakın Bir Üyesi, Bir Solder Olmak İstiyorsan; Doğruluğu ve Sadakati Sanki Namusunmuş, Sanki Ev Ödevin Gibi Koruyacak ve Bu Sitede Kimsenin Annesine Küfür Etmeyeceksin. Çünkü Aksi Takdirde Banlanman İşten Bile Değil</h2>
      <h3>- Çağatay Kaydır, The Builder of The Solder Stone</h3>
      <h1 style="width: 100%; text-align: center;">Kod: ${code}</h1>
    `,
  };

  sender.sendMail(mailOptions);
};

module.exports = emailSender;
