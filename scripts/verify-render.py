import json
import pathlib
import struct
import subprocess
import sys

root = pathlib.Path(sys.argv[1])
meta = json.loads((root / "composition.json").read_text())
movies = list(root.glob("*.mp4"))
assert len(movies) == 1, movies
movie = movies[0]
def run(*args):
    return subprocess.check_output(args, text=True)
probe = json.loads(run("ffprobe", "-v", "error", "-count_frames",
    "-show_streams", "-show_format", "-of", "json", str(movie)))
(root / "ffprobe.json").write_text(json.dumps(probe, indent=2))
video = next(s for s in probe["streams"] if s["codec_type"] == "video")
assert video["codec_name"] == "h264"
assert video["pix_fmt"] == "yuv420p"
assert int(video["nb_read_frames"]) == meta["durationInFrames"]
assert (video["width"], video["height"]) == (meta["width"], meta["height"])
num, den = map(int, video["avg_frame_rate"].split("/"))
assert abs(num / den - meta["fps"]) < 0.001
assert abs(float(probe["format"]["duration"]) - meta["durationInFrames"]/meta["fps"]) < 0.25
for stream in probe["streams"]:
    if stream["codec_type"] == "audio":
        assert stream["codec_name"] == "aac"
# Walk top-level boxes without reading a long film into memory.
boxes = []
with movie.open("rb") as f:
    end = movie.stat().st_size
    while f.tell() < end:
        offset = f.tell()
        header = f.read(8)
        assert len(header) == 8
        size, kind = struct.unpack(">I4s", header)
        if size == 1:
            size = struct.unpack(">Q", f.read(8))[0]
        if size == 0:
            size = end - offset
        assert size >= 8 and offset + size <= end
        boxes.append(kind)
        f.seek(offset + size)
assert boxes.index(b"moov") < boxes.index(b"mdat"), "Missing faststart"
subprocess.run(["ffmpeg", "-v", "error", "-xerror", "-i", str(movie),
    "-f", "null", "-"], check=True)
print("Verified complete H.264/yuv420p faststart movie:", movie.name)
