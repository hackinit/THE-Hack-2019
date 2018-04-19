import boto3
import redis
import StringIO
from multiprocessing import Process

def s3(filename, file_obj):
    s3 = boto3.resource('s3')
    s3.Bucket('thehack').put_object(Key='upload/{}'.format(filename), Body=file_obj)

def upload(token, filename, file_obj):
    db_status = redis.StrictRedis(host='redis', port=6379, db=3)
    try:
        s3(filename, file_obj)
        db_status.set(token, 'success')
    except Exception:
        db_status.set(token, 'failed')
    finally:
        file_obj.close()

if __name__ == '__main__':
    db_filename = redis.StrictRedis(host='redis', port=6379, db=0)
    db_content = redis.StrictRedis(host='redis', port=6379, db=1)
    db_queue = redis.StrictRedis(host='redis', port=6379, db=2)
    p = db_queue.pubsub()
    p.subscribe("upload-channel")
    for message in p.listen():
        token = message['data']
        if db_filename.get(token) is None:
            continue
        filename = db_filename.get(token)
        content = db_content.get(token)

        file_obj = StringIO.StringIO(content)
        file_obj.seek(0)

        p = Process(target=upload, args=(token, filename, file_obj))
        p.start()
