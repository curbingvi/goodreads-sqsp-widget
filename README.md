# GoodReads Squarespace Widget
A widget to show GoodReads shelf on Squarespace websites.

## How to use this widget:
Step 1: Host the Script

Save the script as goodreads-widget.js
Upload to GitHub Pages (free):

Create GitHub repo
Upload the file
Enable Pages in Settings
Your URL: https://yourusername.github.io/repo-name/goodreads-widget.js



Step 2: Add to Squarespace

In Squarespace, add a Code Block
Paste this HTML:

html<div id="my-books" data-goodreads-widget data-user-id="172535297" style="width: 100%; height: 400px;"></div>
<script src="https://yourusername.github.io/repo-name/goodreads-widget.js"></script>

Replace yourusername.github.io/repo-name/ with your actual GitHub Pages URL
Adjust height as needed (height: 400px)

Enable GitHub Pages:

Go to your repo on GitHub
Click "Settings" tab (top right of repo)
Scroll down to "Pages" section (left sidebar)
Under "Source" select "Deploy from a branch"
Choose "main" branch and "/ (root)" folder
Click "Save"

GitHub will show you the URL (like https://yourusername.github.io/repo-name/)
Wait 5-10 minutes for it to deploy, then your script will be available at:
https://yourusername.github.io/repo-name/goodreads-widget.js
Test the URL in your browser - you should see the JavaScript code. Then use that URL in your Squarespace Code Block
