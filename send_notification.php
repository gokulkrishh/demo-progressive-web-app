<?php


if ($_GET["call"] == "true") {
  send_push_message($_GET["sid"]);
}

//Send Google cloud notification
function send_push_message($subscription_ids)
  define("GOOGLE_API_KEY", "AIzaSyCjrU5SqotSg2ybDLK_7rMMt9Rv0dMusvY");
  $url = 'https://android.googleapis.com/gcm/send';

  $fields = array(
    'registration_ids' => $subscription_ids,
  );

  $headers = array(
      'Authorization: key=' . GOOGLE_API_KEY,
      'Content-Type: application/json'
  );

  $ch = curl_init();

  // Set the url, number of POST vars, POST data
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

  // Execute post
  $result = curl_exec($ch);
  if ($result === FALSE) {
      die('Push failed in curl: ' . curl_error($ch));
  }

  // Close connection
  curl_close($ch);
}
?>
