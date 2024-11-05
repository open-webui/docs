
## Data Storage and Bind Mounts

This project uses [Docker named volumes](https://docs.docker.com/storage/volumes/) to **persist data**. If needed, replace the volume name with a host directory:

**Example**:

```bash
-v /path/to/folder:/app/backend/data
```

Ensure the host folder has the correct permissions.
