use std::{env, fs, process::Command};

fn main() -> std::io::Result<()> {
    // Setting up the path to the web client
    let root_dir = env::current_dir()?;
    let client_dir = root_dir.join("web");

    // Get the environment variable
    let vite_api_url = env::var("VITE_API_URL").unwrap_or_default();

    // Building the client
    println!("cargo:rerun-if-changed=web");
    Command::new("npm")
        .arg("run")
        .arg("build")
        .env("VITE_API_URL", vite_api_url) // Set the env var here
        .current_dir(&client_dir)
        .status()?;

    // Check and remove existing 'build' directory if it exists
    let build_dir = root_dir.join("build");
    if build_dir.exists() {
        fs::remove_dir_all(&build_dir)?;
    }

    // Rename web/dist to 'build'
    let from = client_dir.join("dist");
    fs::rename(from, build_dir)?;

    Ok(())
}
