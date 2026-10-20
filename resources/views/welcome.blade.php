<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Directorio Digital') }}</title>
        <link rel="icon" type="image/png" href="/uploads/servigo-icon.png">
        <!-- Wompi Checkout Script -->
        <script src="https://checkout.wompi.co/widget.js"></script>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/src/main.jsx'])
    </head>
    <body class="antialiased">
        <div id="root"></div>
    </body>
</html>
