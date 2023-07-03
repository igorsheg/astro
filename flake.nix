{
  description = "A simple derivation for nix develop including pkg-config and openssl";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }: {
    devShell.x86_64-linux =
      let
        system = "x86_64-linux";
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ ];
        };
      in
      pkgs.mkShell {
        buildInputs = [
          pkgs.pkg-config
          pkgs.openssl
          pkgs.redis
        ];
        RUST_SRC_PATH = "${pkgs.rust.packages.stable.rustPlatform.rustLibSrc}";

        shellHook = ''
          echo "Welcome to your development shell"
        '';
      };
  };
}
