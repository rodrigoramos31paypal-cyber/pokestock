<?php
// Tell the browser we are sending/receiving JSON
header('Content-Type: application/json');

// Get the raw data sent from your JavaScript
$jsonData = file_get_contents('php://input');

// Verify it is actual JSON to prevent errors
if (json_decode($jsonData) !== null) {
    // Write the new ticks to the memory file
    file_put_contents('user_state.json', $jsonData);
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid JSON data"]);
}
?>